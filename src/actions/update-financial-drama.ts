import { createServerFn } from "@tanstack/react-start";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { accountsTable } from "@/db/accounts-schema";
import { getDb } from "@/db/d1";
import { financialDramaTable } from "@/db/schema";

const UpdateFinancialDramaSchema = z.object({
  id: z.string(),
  type: z.enum(["mistake", "blessing"]),
  amount: z.number().gt(0),
  date: z.string().min(1),
  category: z.string().min(1),
  is_planned: z.boolean().default(true),
  notes: z.string().optional(),
  account_id: z.string().optional(),
});

export const updateFinancialDrama = createServerFn({ method: "POST" })
  .validator((data: unknown) => UpdateFinancialDramaSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { useAppSession } = await import("@/lib/session.server");
    const session = await useAppSession();
    const userId = session.data.userId;

    if (!userId) throw new Error("Unauthorized");

    const db = getDb(context);

    const [existing] = await db
      .select()
      .from(financialDramaTable)
      .where(
        and(
          eq(financialDramaTable.id, data.id),
          eq(financialDramaTable.user_id, userId),
        ),
      );

    if (!existing) throw new Error("Financial drama not found");

    // Reverse old account balance effect
    if (existing.account_id) {
      if (existing.type === "blessing") {
        await db
          .update(accountsTable)
          .set({ balance: sql`${accountsTable.balance} - ${existing.amount}` })
          .where(eq(accountsTable.id, existing.account_id));
      } else {
        await db
          .update(accountsTable)
          .set({ balance: sql`${accountsTable.balance} + ${existing.amount}` })
          .where(eq(accountsTable.id, existing.account_id));
      }
    }

    // Update the record
    await db
      .update(financialDramaTable)
      .set({
        type: data.type,
        amount: data.amount,
        date: data.date,
        category: data.category,
        is_planned: data.is_planned,
        notes: data.notes,
        account_id: data.account_id ?? null,
        date_updated: new Date(),
      })
      .where(
        and(
          eq(financialDramaTable.id, data.id),
          eq(financialDramaTable.user_id, userId),
        ),
      );

    // Apply new account balance effect
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
