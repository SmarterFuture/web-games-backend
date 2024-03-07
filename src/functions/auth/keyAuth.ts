import { v4 as uuidv4 } from "uuid";
import { db, tables } from "../../shared/db.config";
import { and, eq, gt, sql } from "drizzle-orm";
import { Err, Ok, Result } from "../../shared/types";


export async function createKey (uuid: number) {
    const key = uuidv4();

    const dbOldKey = db.select({ key: tables.cert.key })
        .from(tables.cert)
        .where(eq(tables.cert.uuid, uuid));


    const dbNewKey = db.insert(tables.cert)
        .values({
            uuid: uuid,
            key: key
        })
        .onConflictDoUpdate({
            target: tables.cert.uuid,
            set: {
                key: key,
                expiration: sql`default`
            },
            where: sql`now() > ${tables.cert.expiration}`
        })
        .returning({ key: tables.cert.key });

    return Promise.all([dbOldKey, dbNewKey])
        .then(([oldkey, newkey]) => {
            if ( newkey.length !== 0 ) { 
                return newkey[0].key;
            }
            return oldkey[0].key;
        });
}

export async function validKey (key: string) {
    const dbActiveUser = db.select({ uuid: tables.cert.uuid })
        .from(tables.cert)
        .where(eq(tables.cert.key, key));

    const dbDeadUser = db.delete(tables.cert)
        .where(
            and(
                eq(tables.cert.key, key),
                gt(sql`now()`, tables.cert.expiration)
        ))
        .returning({ uuid: tables.cert.uuid });

    return Promise.all([dbDeadUser, dbActiveUser])
        .then(([deadUser, activeUser]) => {
            if ( activeUser.length === 0 || deadUser.length !== 0 ) {
                return Err(null) as Result<number, null>;
            }
            return Ok(activeUser[0].uuid) as Result<number, null>;
        });
}
