import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { accountsTable } from "@/db/accounts-schema";
import { getDb } from "@/db/d1";

const UpdateAccountSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  type: z.string().min(1),
  balance: z.number(),
});

export const updateAccount = createServerFn({ method: "POST" })
  .validator((data: unknown) => UpdateAccountSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { useAppSession } = await import("@/lib/session.server");
    const session = await useAppSession();
    const userId = session.data.userId;

    if (!userId) throw new Error("Unauthorized");

    const db = getDb(context);
    await db
      .update(accountsTable)
      .set({
        name: data.name,
        type: data.type,
        balance: data.balance,
        date_updated: new Date(),
      })
      .where(
        and(eq(accountsTable.id, data.id), eq(accountsTable.user_id, userId)),
      );

    return { success: true };
  });
