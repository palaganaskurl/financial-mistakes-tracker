import { createServerFn } from "@tanstack/react-start";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { accountsTable } from "@/db/accounts-schema";
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

    // Reverse account balance effect
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
