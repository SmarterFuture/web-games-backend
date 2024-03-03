import { Request, Response } from "express";
import { is } from "superstruct";
import { db, tables } from "../../shared/db.config";
import { TsignUp } from "../../shared/types/auth";
import { eq, sql } from "drizzle-orm";


export function signUp (req: Request, res: Response) {
    if ( req.body === undefined ) {
        res.status(400).json({ err: "No data" });
        return;
    }
    if ( !is(req.body, TsignUp) ) {
        res.status(400).json({ err: "Invalid data" });
        return;
    }
    
    const name: string = req.body.name;
    const password: string = req.body.password;
    
    db.select({
            field: sql<string>`count(1) > 0`
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
            } else {
                return db.insert(tables.auth)
                    .values({
                        uname: name,
                        password: password
                    });
            }
        })
        .then((_) => {
            res.status(200).json({ msg: "User was signed in" });
        })
        .catch((err) => {
            if ( err === "done") { return; }
            res.status(500).json(err);
        });
}
