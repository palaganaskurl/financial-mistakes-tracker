import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";
import * as authSchema from "./auth-schema";

export const budgetsTable = sqliteTable("budgets", {
  id: text()
    .primaryKey()
    .$defaultFn(() => uuid()),
  category: text().notNull(),
  amount_limit: integer().notNull(),
  period: text().notNull().default("monthly"),
  month: integer().notNull(),
  year: integer().notNull(),
  user_id: text("user_id")
    .references(() => authSchema.user.id, { onDelete: "cascade" })
    .notNull(),
  date_created: integer({ mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  date_updated: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
});
