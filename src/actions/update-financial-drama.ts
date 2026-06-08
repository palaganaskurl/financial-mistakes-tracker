import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
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
  blessings_account_id: z.string().optional(),
});

export const updateFinancialDrama = createServerFn({ method: "POST" })
  .validator((data: unknown) => UpdateFinancialDramaSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { useAppSession } = await import("@/lib/session.server");
    const session = await useAppSession();
    const userId = session.data.userId;

    if (!userId) throw new Error("Unauthorized");

    const db = getDb(context);
    await db
      .update(financialDramaTable)
      .set({
        type: data.type,
        amount: data.amount,
        date: data.date,
        category: data.category,
        is_planned: data.is_planned,
        notes: data.notes,
        blessings_account_id: data.blessings_account_id ?? null,
        date_updated: new Date(),
      })
      .where(
        and(
          eq(financialDramaTable.id, data.id),
          eq(financialDramaTable.user_id, userId),
        ),
      );

    return { success: true };
  });
