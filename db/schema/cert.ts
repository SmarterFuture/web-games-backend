import { varchar, index, pgTable, integer, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";


export const cert = pgTable("cert", {
    uuid: integer("uuid").unique(),
    key: varchar("key", {length: 36}).notNull(),
    expiration: timestamp("expiration", {precision: 0, withTimezone: true})
        .default(sql`now() + interval '30 minutes'`).notNull()
}, (table) => {
    return {
        idx_key: index("idx_key").on(table.key).using(sql`HASH ("key")`)
    };
});

