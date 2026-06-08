import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";
import * as authSchema from "./auth-schema";

export const recurringTable = sqliteTable("recurring", {
  id: text()
    .primaryKey()
    .$defaultFn(() => uuid()),
  name: text().notNull(),
  type: text().notNull(),
  amount: integer().notNull(),
  category: text().notNull(),
  frequency: text().notNull(),
  start_date: text().notNull(),
  end_date: text(),
  is_active: integer({ mode: "boolean" }).default(true).notNull(),
  user_id: text("user_id")
    .references(() => authSchema.user.id, { onDelete: "cascade" })
    .notNull(),
  date_created: integer({ mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  date_updated: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
});
