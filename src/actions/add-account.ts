import { createServerFn } from "@tanstack/react-start";
import { getDb } from "@/db/d1";
import { accountsTable } from "@/db/accounts-schema";
import { getSession } from "@/lib/session";

export const addAccount = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as FormData)
  .handler(async ({ data: formData, context }) => {
    const session = await getSession();

    if (!session.isLoggedIn) {
      throw new Error("Not logged in");
    }

    const db = getDb(context);

    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const balance = parseInt(formData.get("balance") as string, 10);

    if (!name || !type || isNaN(balance)) {
      throw new Error("Invalid account data");
    }

    try {
      await db.insert(accountsTable).values({
        name,
        type,
        balance,
        currency: "PHP",
        user_id: session.userId,
      });

      return { success: true };
    } catch (error) {
      console.error("Error inserting account:", error);
      throw error;
    }
  });
