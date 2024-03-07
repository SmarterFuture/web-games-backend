import { Request, Response } from "express";
import { db, tables } from "../../shared/db.config";
import { Tlogin } from "../../shared/types/auth";
import { eq, sql } from "drizzle-orm";
import { validateData } from "../shared";
import {createKey} from "./keyAuth";


export function signup (req: Request, res: Response) {

    const body = validateData(req.body, Tlogin);
    if ( !body.ok ) {
        res.status(400).json(body);
        return;
    }
    
    const name: string = body.data.name;
    const password: string = body.data.password;
    
    db.select({
            field: sql`count(1) > 0`
        })
        .from(tables.auth)
        .where(eq(tables.auth.uname, name))
        .then((val) => {
            return val[0].field;
        })
        .then((exists) => {
            if ( exists ) {
                res.status(400).json({ err: "User already exists" });
                return Promise.reject("done");
            }
            return db.insert(tables.auth)
                .values({
                    uname: name,
                    password: password
                })
                .returning({ uuid: tables.auth.uuid });
        })
        .then((dbuuid) => {
            return createKey(dbuuid[0].uuid);
        })
        .then((key) => {
            res.status(200).json({
                msg: "User was signed in",
                key: key
            });
        })
        .catch((err) => {
            if ( err === "done") { return; }
            res.status(500).json(err);
        });
}
