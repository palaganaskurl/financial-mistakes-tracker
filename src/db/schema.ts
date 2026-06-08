import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";
import { accountsTable } from "./accounts-schema";
import * as authSchema from "./auth-schema";
import { transfersTable } from "./transfers-schema";

export { transfersTable } from "./transfers-schema";

export const financialDramaTable = sqliteTable("financialDrama", {
  id: text()
    .primaryKey()
    .$defaultFn(() => uuid()),
  type: text().notNull(),
  amount: integer().notNull(),
  date: text().notNull(),
  category: text().notNull(),
  is_planned: integer({ mode: "boolean" }).default(true).notNull(),
  notes: text(),
  date_created: integer({ mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  date_updated: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
  user_id: text("user_id")
    .references(() => authSchema.user.id, { onDelete: "cascade" })
    .notNull(),
  blessings_account_id: text("blessings_account_id").references(
    () => accountsTable.id,
    { onDelete: "set null" },
  ),
});

export const schema = {
  ...authSchema,
  ...financialDramaTable,
  ...accountsTable,
  transfersTable,
} as const;
