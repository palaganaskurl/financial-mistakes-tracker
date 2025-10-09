"use server";

import { FinancialDramaFormSchema } from "@/constants";
import { getDb } from "@/db/postgres";
import { financialDramaTable } from "@/db/schema";
import z from "zod";

export default async function addMistake(
  values: z.infer<typeof FinancialDramaFormSchema>
) {
  const db = getDb();
  const data: typeof financialDramaTable.$inferInsert = values;

  try {
    await db.insert(financialDramaTable).values(data);

    return true;
  } catch (error) {
    console.error("Error adding mistake:", error);

    return false;
  }
}
