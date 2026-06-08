import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { accountsTable } from "@/db/accounts-schema";
import { getDb } from "@/db/d1";

export const deleteAccount = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data, context }) => {
    const { useAppSession } = await import("@/lib/session.server");
    const session = await useAppSession();
    const userId = session.data.userId;

    if (!userId) throw new Error("Unauthorized");

    const db = getDb(context);
    await db
      .delete(accountsTable)
      .where(
        and(eq(accountsTable.id, data.id), eq(accountsTable.user_id, userId)),
      );

    return { success: true };
  });
