import { v4 as uuidv4 } from "uuid";
import { db, tables } from "../../shared/db.config";
import { and, eq, gt, sql } from "drizzle-orm";
import { Err, Ok, Result } from "../../shared/types";


export async function createToken (uid: number) {
    const cwt = tables.userToken;
    const token = uuidv4();

    const oldTokenQuerry = db.select({ token: cwt.token })
        .from(cwt)
        .where(eq(cwt.uid, uid));

    const newTokenQuerry = db.insert(cwt)
        .values({
            uid: uid,
            token: token
        })
        .onConflictDoUpdate({
            target: cwt.uid,
            set: {
                token: token,
                expiration: sql`default`
            },
            where: sql`now() > ${cwt.expiration}`
        })
        .returning({ token: cwt.token });

    return Promise.all([oldTokenQuerry, newTokenQuerry])
        .then(([oldTokens, newTokens]) => {
            if ( newTokens.length !== 0 ) { 
                return newTokens[0].token;
            }
            return oldTokens[0].token;
        });
}

export async function validToken (token: string) {
    const cwt = tables.userToken;

    const activeTokenQuerry = db.select({ uid: cwt.uid })
        .from(cwt)
        .where(eq(cwt.token, token));

    const expiredTokenQuerry = db.delete(cwt)
        .where(
            and(
                eq(cwt.token, token),
                gt(sql`now()`, cwt.expiration)
        ))
        .returning({ uid: cwt.uid });

    return Promise.all([expiredTokenQuerry, activeTokenQuerry])
        .then(([expiredTokens, activeTokens]) => {
            if ( activeTokens.length === 0 || expiredTokens.length !== 0 ) {
                return Err(null) as Result<number, null>;
            }
            return Ok(activeTokens[0].uid) as Result<number, null>;
        });
}
