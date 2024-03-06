import { Request, Response } from "express";
import { Tlogin } from "../../shared/types/auth";
import { validateData } from "../shared";
import { db, tables } from "../../shared/db.config";
import { eq } from "drizzle-orm";
import { createKey } from "./keyAuth";


export function login (req: Request, res: Response) {

    const body = validateData(req.body, Tlogin);
    if ( !body.ok ) {
        res.status(400).json(body);
        return;
    }

    const name: string = body.data.name;
    const password: string = body.data.password;

    db.select()
        .from(tables.auth)
        .where(eq(tables.auth.uname, name))
        .then((val) => {
            if ( val[0].password !== password ) {
                res.status(400).json({ err: "Name or password is incorrect"});
                return Promise.reject("done");
            }
            return val[0].uuid;
        })
        .then((uuid) => {
            return createKey(uuid);
        })
        .then((key) => {
            res.status(200).json({
                msg: "put some hash here",
                key: key
            });
        })
        .catch((err) => {
            console.log(err);
            if ( err === "done" ) { return; }
            res.status(500).json(err);
        });
}
