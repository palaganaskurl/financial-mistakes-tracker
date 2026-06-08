import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { accountsTable } from "@/db/accounts-schema";
import { getDb } from "@/db/d1";
import { transfersTable } from "@/db/transfers-schema";

const AddTransferSchema = z.object({
  from_account_id: z.string().min(1),
  to_account_id: z.string().min(1),
  amount: z.number().gt(0),
  date: z.string().min(1),
  notes: z.string().optional(),
});

export const addTransfer = createServerFn({ method: "POST" })
  .validator((data: unknown) => AddTransferSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { useAppSession } = await import("@/lib/session.server");
    const session = await useAppSession();
    const userId = session.data.userId;

    if (!userId) throw new Error("Unauthorized");

    const db = getDb(context);

    const [fromAccount] = await db
      .select()
      .from(accountsTable)
      .where(
        and(
          eq(accountsTable.id, data.from_account_id),
          eq(accountsTable.user_id, userId),
        ),
      );

    const [toAccount] = await db
      .select()
      .from(accountsTable)
      .where(
        and(
          eq(accountsTable.id, data.to_account_id),
          eq(accountsTable.user_id, userId),
        ),
      );

    if (!fromAccount || !toAccount) throw new Error("Account not found");

    await db
      .update(accountsTable)
      .set({
        balance: fromAccount.balance - data.amount,
        date_updated: new Date(),
      })
      .where(eq(accountsTable.id, data.from_account_id));

    await db
      .update(accountsTable)
      .set({
        balance: toAccount.balance + data.amount,
        date_updated: new Date(),
      })
      .where(eq(accountsTable.id, data.to_account_id));

    await db.insert(transfersTable).values({
      from_account_id: data.from_account_id,
      to_account_id: data.to_account_id,
      amount: data.amount,
      date: data.date,
      notes: data.notes,
      user_id: userId,
    });

    return { success: true };
  });
