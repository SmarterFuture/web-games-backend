import * as schema from "../db";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import "dotenv/config";


const port: number = Number(process.env.PGPORT) || 5432;

const pool = new Pool({
    host: process.env.PGHOST,
    port: port,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE
}) 

export const db = drizzle(pool, { schema });
export * as table from "../db";
