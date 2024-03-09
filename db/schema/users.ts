import { varchar, index, pgTable, serial, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";


export const users = pgTable("Users", {
    uid: serial("uid").primaryKey(),
    handle: varchar("handle", { length: 20 }).notNull().unique(),
    name: text("name"),
    password: text("password").notNull()
}, ( table ) => {
    return {
        idx_handle: index("idx_handle").on(table.handle).using(sql`hash(handle)`)
    };
});

