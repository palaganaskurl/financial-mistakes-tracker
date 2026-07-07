import { createServerFn } from "@tanstack/react-start";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { accountsTable } from "@/db/accounts-schema";
import { getDb } from "@/db/d1";
import { financialDramaTable } from "@/db/schema";

const AddMistakeSchema = z.object({
  type: z.enum(["mistake", "blessing"]),
  amount: z.number().gt(0),
  date: z.string().min(1),
  category: z.string().min(1),
  is_planned: z.boolean().default(true),
  notes: z.string().optional(),
  account_id: z.string().optional(),
});

export const addMistake = createServerFn({ method: "POST" })
  .validator((data: unknown) => AddMistakeSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { useAppSession } = await import("@/lib/session.server");
    const session = await useAppSession();
    const userId = session.data.userId;

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const db = getDb(context);

    await db.insert(financialDramaTable).values({
      type: data.type,
      amount: data.amount,
      date: data.date,
      category: data.category,
      is_planned: data.is_planned,
      notes: data.notes,
      user_id: userId,
      account_id: data.account_id ?? null,
    });

    if (data.account_id) {
      if (data.type === "blessing") {
        await db
          .update(accountsTable)
          .set({ balance: sql`${accountsTable.balance} + ${data.amount}` })
          .where(eq(accountsTable.id, data.account_id));
      } else {
        await db
          .update(accountsTable)
          .set({ balance: sql`${accountsTable.balance} - ${data.amount}` })
          .where(eq(accountsTable.id, data.account_id));
      }
    }

    return { success: true };
  });
