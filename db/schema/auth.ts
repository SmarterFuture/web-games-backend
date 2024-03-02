import { varchar, index, pgTable } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";


export const auth = pgTable("auth", {
    uname: varchar("uname", {length: 15}).notNull(),
    password: varchar("password", {length: 32}).notNull()
}, ( table ) => {
    return {
        idx_uname: index("idx_uname").on(table.uname).using(sql`HASH ("uname")`)
    }
}
);
