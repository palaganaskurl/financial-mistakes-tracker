import { createServerFn } from "@tanstack/react-start";
import { getDb } from "@/db/d1";
import { FinancialDramaFormSchema } from "@/constants";
import { financialDramaTable } from "@/db/schema";
import z from "zod";

export const addMistake = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) => data as z.infer<typeof FinancialDramaFormSchema>,
  )
  .handler(async ({ data: values, context }) => {
    const db = getDb(context);

    const data: typeof financialDramaTable.$inferInsert = {
      type: values.type,
      amount: values.amount,
      date: values.date.toISOString(),
      category: values.category[0],
      is_planned: values.is_planned,
      notes: values.notes,
      user_id: values.user_id,
    };

    if (values.blessings_account_id && values.blessings_account_id.length > 0) {
      data.blessings_account_id = values.blessings_account_id[0];
    }

    try {
      await db.insert(financialDramaTable).values(data);
      return true;
    } catch (error) {
      console.error("Error adding mistake:", error);
      return false;
    }
  });
