import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db/d1";
import { recurringTable } from "@/db/schema";

const UpdateRecurringSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(["mistake", "blessing"]),
  amount: z.number().gt(0),
  category: z.string().min(1),
  frequency: z.enum(["weekly", "monthly", "yearly"]),
  start_date: z.string().min(1),
  end_date: z.string().optional(),
  is_active: z.boolean().default(true),
});

export const updateRecurring = createServerFn({ method: "POST" })
  .validator((data: unknown) => UpdateRecurringSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { useAppSession } = await import("@/lib/session.server");
    const session = await useAppSession();
    const userId = session.data.userId;

    if (!userId) throw new Error("Unauthorized");

    const db = getDb(context);

    await db
      .update(recurringTable)
      .set({
        name: data.name,
        type: data.type,
        amount: data.amount,
        category: data.category,
        frequency: data.frequency,
        start_date: data.start_date,
        end_date: data.end_date ?? null,
        is_active: data.is_active,
        date_updated: new Date(),
      })
      .where(
        and(eq(recurringTable.id, data.id), eq(recurringTable.user_id, userId)),
      );

    return { success: true };
  });
