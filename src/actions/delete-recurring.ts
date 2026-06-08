import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db/d1";
import { recurringTable } from "@/db/schema";

export const deleteRecurring = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data, context }) => {
    const { useAppSession } = await import("@/lib/session.server");
    const session = await useAppSession();
    const userId = session.data.userId;

    if (!userId) throw new Error("Unauthorized");

    const db = getDb(context);

    await db
      .delete(recurringTable)
      .where(
        and(eq(recurringTable.id, data.id), eq(recurringTable.user_id, userId)),
      );

    return { success: true };
  });
