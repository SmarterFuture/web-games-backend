import dotenv from "dotenv";
dotenv.config({
    path: "../.env"
});
import express from "express";
import { Request, Response } from "express-serve-static-core";
import { db, table } from "./db.config";

const app = express();

const PORT = 9000;

function getUnames (_: Request, res: Response) {
    db.select().from(table.auth)
        .then((val) => { res.status(200).json(val); })
        .catch((err) => { res.status(404).json(err); })
};

function helloWorld (_: Request, res: Response) {
    res.send("Hello World!");
};

app.get("/", helloWorld);
app.get("/unames", getUnames);

app.listen(PORT, () => { console.log("Server connected"); 
});
