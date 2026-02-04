import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import * as authSchema from "./auth-schema";

export const financialDramaTable = sqliteTable("financialDrama", {
  id: integer().primaryKey({ autoIncrement: true }),
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
});

export const schema = {
  ...authSchema,
  ...financialDramaTable,
} as const;
