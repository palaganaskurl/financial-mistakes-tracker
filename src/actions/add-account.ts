import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { accountsTable } from "@/db/accounts-schema";
import { getDb } from "@/db/d1";
import { useAppSession } from "@/lib/session";

const AddAccountSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  balance: z.number(),
});

export const addAccount = createServerFn({ method: "POST" })
  .validator((data: unknown) => AddAccountSchema.parse(data))
  .handler(async ({ data, context }) => {
    const session = await useAppSession();
    const userId = session.data.userId;
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const db = getDb(context);

    try {
      await db.insert(accountsTable).values({
        name: data.name,
        type: data.type,
        balance: data.balance,
        currency: "PHP",
        user_id: userId,
      });

      return { success: true };
    } catch (error) {
      console.error("Error inserting account:", error);
      throw error;
    }
  });
