import { Request, Response } from "express";
import { db, tables } from "../shared/db.config";
import { object, string } from "superstruct";
import { validateData } from "./shared";
import { validToken } from "./auth/token";


const Ttoken = object({
    token: string()
});


export function getUnames (_: Request, res: Response) {
    db.select().from(tables.users)
        .then((val) => { res.status(200).json(val); })
        .catch((err) => { res.status(404).json(err); });
}

export function helloWorld (_: Request, res: Response) {
    res.send("Hello World!");
}

export function echo (req: Request, res: Response) {
    res.status(200).json(req.body);
}

export function checkKey (req: Request, res: Response) {
    const body = validateData(req.body, Ttoken);
    if ( !body.ok ) {
        res.status(400).json({ err: body.error });
        return;
    }

    const token = body.data.token;

    return validToken(token)
        .then((val) => {
            res.status(200).json({ valid: val});
        })
        .catch((err) => {
            res.status(500).json({ err: err });
        });
} 
