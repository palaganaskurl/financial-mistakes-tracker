import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db/d1";
import { budgetsTable } from "@/db/schema";

const UpdateBudgetSchema = z.object({
  id: z.string().min(1),
  category: z.string().min(1),
  amount_limit: z.number().gt(0),
  month: z.number().min(1).max(12),
  year: z.number().min(2020),
});

export const updateBudget = createServerFn({ method: "POST" })
  .validator((data: unknown) => UpdateBudgetSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { useAppSession } = await import("@/lib/session.server");
    const session = await useAppSession();
    const userId = session.data.userId;

    if (!userId) throw new Error("Unauthorized");

    const db = getDb(context);

    await db
      .update(budgetsTable)
      .set({
        category: data.category,
        amount_limit: data.amount_limit,
        month: data.month,
        year: data.year,
        date_updated: new Date(),
      })
      .where(eq(budgetsTable.id, data.id));

    return { success: true };
  });
