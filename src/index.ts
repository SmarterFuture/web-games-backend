import dotenv from "dotenv";
dotenv.config({
    path: "../.env"
});
import express from "express";
import fs from "fs";
import http from "http";
import https from "https";
import { Request, Response } from "express-serve-static-core";

import { db, tables } from "./shared/db.config";

const app = express();
app.use(express.json())

const PORT = process.env.PORT || 9000;

function getUnames (_: Request, res: Response) {
    db.select().from(tables.auth)
        .then((val) => { res.status(200).json(val); })
        .catch((err) => { res.status(404).json(err); })
};

function helloWorld (_: Request, res: Response) {
    res.send("Hello World!");
};

function echo (req: Request, res: Response) {
    res.status(200).json(req.body);
}

app.get("/", helloWorld);
app.get("/unames", getUnames);
app.post("/echo", echo);


const httpServer = http.createServer(app);
const httpsServer = https.createServer({
    key: fs.readFileSync(process.env.PRIVATEKEY || ""),
    cert: fs.readFileSync(process.env.CERTIFICATE || "")
}, app);


httpServer.listen(80, () => {
    console.log("HTTP connected");
});

httpsServer.listen(PORT, () => {
    console.log("HTTPS connected", PORT);
});

