import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getDb } from "@/db/d1";
import { budgetsTable } from "@/db/schema";

const AddBudgetSchema = z.object({
  category: z.string().min(1),
  amount_limit: z.number().gt(0),
  month: z.number().min(1).max(12),
  year: z.number().min(2020),
});

export const addBudget = createServerFn({ method: "POST" })
  .validator((data: unknown) => AddBudgetSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { useAppSession } = await import("@/lib/session.server");
    const session = await useAppSession();
    const userId = session.data.userId;

    if (!userId) throw new Error("Unauthorized");

    const db = getDb(context);

    await db.insert(budgetsTable).values({
      category: data.category,
      amount_limit: data.amount_limit,
      period: "monthly",
      month: data.month,
      year: data.year,
      user_id: userId,
    });

    return { success: true };
  });
