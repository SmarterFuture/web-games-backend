import { Request, Response } from "express";
import { Tlogin } from "./shared";
import { validateData } from "../shared";
import { db, tables } from "../../shared/db.config";
import { SQL, and, eq, sql } from "drizzle-orm";
import { createToken } from "./token";


export function login (req: Request, res: Response) {
    const cwt = tables.users;

    const body = validateData(req.body, Tlogin);
    if ( !body.ok ) {
        res.status(400).json(body);
        return;
    }

    const handle: string = body.data.handle;
    const password: SQL = sql.raw(`crypt('${body.data.password}', password)`);

    db.select({ uid: cwt.uid })
        .from(cwt)
        .where(
            and(
                eq(cwt.handle, handle),
                eq(cwt.password, password)
        ))
        .then((uids) => {
            if ( uids.length === 0 ) {
                res.status(400).json({ err: "Handle or password is incorrect"});
                return Promise.reject("done");
            }
            return createToken(uids[0].uid);
        })
        .then((token) => {
            res.status(200).json({
                msg: "User was logged in",
                token: token
            });
        })
        .catch((err) => {
            if ( err === "done" ) { return; }
            res.status(500).json(err);
        });
}
