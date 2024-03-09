import { varchar, index, pgTable, integer, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users";


const tokenLifetime: number = 30;   // in minutes

export const userToken = pgTable("UserToken", {
    uid: integer("uid")
        .references(() => users.uid, { onDelete: "cascade", onUpdate: "cascade" })
        .notNull()
        .unique(),
    token: varchar("token", { length: 36 }).notNull(),
    expiration: timestamp("expiration", { precision: 0, withTimezone: true })
        .default(sql.raw(`now() + interval '${tokenLifetime} minutes'`))
}, ( table ) => {
    return {
        idx_token: index("idx_token").on(table.token).using(sql`hash(token)`)
    };
});

