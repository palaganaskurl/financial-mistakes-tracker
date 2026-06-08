import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";
import { accountsTable } from "./accounts-schema";
import * as authSchema from "./auth-schema";

export const transfersTable = sqliteTable("transfers", {
  id: text()
    .primaryKey()
    .$defaultFn(() => uuid()),
  from_account_id: text("from_account_id").references(() => accountsTable.id, {
    onDelete: "set null",
  }),
  to_account_id: text("to_account_id").references(() => accountsTable.id, {
    onDelete: "set null",
  }),
  amount: integer().notNull(),
  date: text().notNull(),
  notes: text(),
  user_id: text("user_id")
    .references(() => authSchema.user.id, { onDelete: "cascade" })
    .notNull(),
  date_created: integer({ mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});
