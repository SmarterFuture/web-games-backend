import { Request, Response } from "express";
import { Tlogin } from "../../shared/types/auth";
import { validate } from "../shared";
import { db, tables } from "../../shared/db.config";
import { eq } from "drizzle-orm";


export function login (req: Request, res: Response) {

    const body = validate(req.body, Tlogin);
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
            return val[0].password === password;
        })
        .then((valid) => {
            if ( valid ) {
                res.status(200).json({ msg: "put some hash here"});
            } else {
                res.status(400).json({ err: "Name or password is incorrect"});
            }
        })
        .catch((err) => {
            res.status(500).json(err);
        });
}
