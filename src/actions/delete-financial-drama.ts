import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db/d1";
import { financialDramaTable } from "@/db/schema";

export const deleteFinancialDrama = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data, context }) => {
    const { useAppSession } = await import("@/lib/session.server");
    const session = await useAppSession();
    const userId = session.data.userId;

    if (!userId) throw new Error("Unauthorized");

    const db = getDb(context);
    await db
      .delete(financialDramaTable)
      .where(
        and(
          eq(financialDramaTable.id, data.id),
          eq(financialDramaTable.user_id, userId),
        ),
      );

    return { success: true };
  });
