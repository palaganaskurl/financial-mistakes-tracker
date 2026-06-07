import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getDb } from "@/db/d1";
import { accountsTable } from "@/db/accounts-schema";

const AddAccountSchema = z.object({
	name: z.string().min(1),
	type: z.string().min(1),
	balance: z.number(),
	// TODO: replace with value from auth session once auth is implemented
	userId: z.string(),
});

export const addAccount = createServerFn({ method: "POST" })
	.validator((data: unknown) => AddAccountSchema.parse(data))
	.handler(async ({ data, context }) => {
		const db = getDb(context);

		await db.insert(accountsTable).values({
			name: data.name,
			type: data.type,
			balance: data.balance,
			user_id: data.userId,
		});

		return { success: true };
	});
