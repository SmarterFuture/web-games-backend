import { v4 as uuidv4 } from "uuid";
import { db, tables } from "../../shared/db.config";
import { eq, sql } from "drizzle-orm";


export async function createKey (uuid: number) {
    const key = uuidv4();
    return db.insert(tables.cert)
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
            where: sql`${tables.cert.expiration} < now()`
        })
        .returning({ key: tables.cert.key })
        .then(( dbkey ) => {
            if ( dbkey.length !== 0 ) { 
                return dbkey[0].key;
            }
            return db.select({ key: tables.cert.key })
                .from(tables.cert)
                .where(eq(tables.cert.uuid, uuid))
                .then((val) => {
                    return val[0].key;
                });
        });
}

export async function validKey (key: string) {
    return db.select()
        .from(tables.cert)
        .innerJoin(tables.auth, eq(tables.cert.uuid, tables.auth.uuid))
        .where(eq(tables.cert.key, key))
        .then((val) => {
            const expire = new Date(val[0].cert.expiration);
            const now = new Date();
            return expire > now;
        })
        .then((valid) => {
            if ( valid ) {
                return valid;
            }
            return db.delete(tables.cert)
                .where(eq(tables.cert.key, key))
                .then((_) => {
                    return valid;
                });
        });
}
