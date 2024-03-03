import dotenv from "dotenv";
dotenv.config({
    path: "../.env"
});
import express from "express";
import fs from "fs";
import http from "http";
import https from "https";

import { helloWorld, getUnames, echo } from "./functions/test";
import { signUp } from "./functions/auth/signUp";

const PORT = process.env.PORT || 9000;

const app = express();
app.use(express.json());


app.get("/", helloWorld);
app.get("/unames", getUnames);
app.post("/echo", echo);
app.post("/signUp", signUp);


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

