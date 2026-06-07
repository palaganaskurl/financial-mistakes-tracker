import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getDb } from "@/db/d1";
import { financialDramaTable } from "@/db/schema";

const AddMistakeSchema = z.object({
  type: z.enum(["mistake", "blessing"]),
  amount: z.number().gt(0),
  date: z.string().min(1),
  category: z.string().min(1),
  is_planned: z.boolean().default(true),
  notes: z.string().optional(),
  user_id: z.string(),
  blessings_account_id: z.string().optional(),
});

export const addMistake = createServerFn({ method: "POST" })
  .validator((data: unknown) => AddMistakeSchema.parse(data))
  .handler(async ({ data, context }) => {
    const db = getDb(context);

    await db.insert(financialDramaTable).values({
      type: data.type,
      amount: data.amount,
      date: data.date,
      category: data.category,
      is_planned: data.is_planned,
      notes: data.notes,
      user_id: data.user_id,
      blessings_account_id: data.blessings_account_id ?? null,
    });

    return { success: true };
  });
