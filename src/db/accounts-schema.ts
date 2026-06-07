import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";
import * as authSchema from "./auth-schema";

export const accountsTable = sqliteTable("accounts", {
	id: text()
		.primaryKey()
		.$defaultFn(() => uuid()),
	name: text().notNull(),
	type: text().notNull(), // e.g., "savings", "checking", "credit_card"
	balance: integer().notNull().default(0),
	currency: text().notNull().default("PHP"),
	date_created: integer({ mode: "timestamp" })
		.$defaultFn(() => new Date())
		.notNull(),
	date_updated: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
	user_id: text("user_id")
		.references(() => authSchema.user.id, { onDelete: "cascade" })
		.notNull(),
});
