import {
  BlessingCategories,
  BlessingCategoriesValues,
  FinancialDramaTypes,
  MistakeCategoriesValues,
} from "@/constants";
import {
  integer,
  pgTable,
  timestamp,
  pgEnum,
  boolean,
  varchar,
  decimal,
} from "drizzle-orm/pg-core";

// TODO: Check if there's a way to validate the enum
//  depending on the type of financial drama
export const categoryEnum = pgEnum("category", [
  ...MistakeCategoriesValues,
  ...BlessingCategoriesValues,
] as [string, ...string[]]);

export const financialDramaTypeEnum = pgEnum("type", FinancialDramaTypes);

export const financialDramaTable = pgTable("financialDrama", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  type: financialDramaTypeEnum().notNull(),
  amount: decimal({
    mode: "number",
  }).notNull(),
  date: timestamp({
    precision: 6,
    withTimezone: true,
  }).notNull(),
  category: categoryEnum().notNull(),
  is_planned: boolean().default(true).notNull(),
  notes: varchar(),
  date_created: timestamp({
    precision: 6,
    withTimezone: true,
  }).defaultNow(),
  date_updated: timestamp({
    precision: 6,
    withTimezone: true,
  }).defaultNow(),
});
