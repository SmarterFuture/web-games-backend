import { Request, Response } from "express";
import { db, tables } from "../shared/db.config";


export function getUnames (_: Request, res: Response) {
    db.select().from(tables.auth)
        .then((val) => { res.status(200).json(val); })
        .catch((err) => { res.status(404).json(err); });
}

export function helloWorld (_: Request, res: Response) {
    res.send("Hello World!");
}

export function echo (req: Request, res: Response) {
    res.status(200).json(req.body);
}

