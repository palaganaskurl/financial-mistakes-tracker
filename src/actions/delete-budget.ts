import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db/d1";
import { budgetsTable } from "@/db/schema";

export const deleteBudget = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.string().min(1) }).parse(data))
  .handler(async ({ data, context }) => {
    const { useAppSession } = await import("@/lib/session.server");
    const session = await useAppSession();

    if (!session.data.userId) throw new Error("Unauthorized");

    const db = getDb(context);
    await db.delete(budgetsTable).where(eq(budgetsTable.id, data.id));

    return { success: true };
  });
