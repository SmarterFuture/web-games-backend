import { Request, Response } from "express";
import { db, tables } from "../../shared/db.config";
import { Tsignup } from "./shared";
import { SQL, sql } from "drizzle-orm";
import { validateData } from "../shared";
import { createToken } from "./token";


export function signup (req: Request, res: Response) {
    const cwt = tables.users;

    const body = validateData(req.body, Tsignup);
    if ( !body.ok ) {
        res.status(400).json(body);
        return;
    }
    
    const handle: string = body.data.handle;
    const name: string = body.data.name;
    const password: SQL = sql.raw(`crypt('${body.data.password}', gen_salt('bf'))`);

    db.insert(tables.users)
        .values({
            handle: handle,
            name: name,
            password: password
        })
        .onConflictDoNothing()
        .returning({ uid: cwt.uid })
        .then((uids) => {
            if ( uids.length === 0) {
                res.status(400).json({ err: "User already exists" });
                return Promise.reject("done");
            }
            return createToken(uids[0].uid);
        })
        .then((token) => {
            res.status(200).json({
                msg: "User was signed in",
                token: token
            });
        })
        .catch((err) => {
            if ( err === "done" ) { return; }
            res.status(500).json(err);
        });
}
