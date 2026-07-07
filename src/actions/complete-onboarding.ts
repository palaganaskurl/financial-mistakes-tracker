import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { accountsTable } from "@/db/accounts-schema";
import { user } from "@/db/auth-schema";
import { getDb } from "@/db/d1";
import { eq } from "drizzle-orm";

const CompleteOnboardingSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  type: z.string().min(1, "Account type is required"),
  balance: z.number(),
});

export const completeOnboarding = createServerFn({ method: "POST" })
  .validator((data: unknown) => CompleteOnboardingSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { useAppSession } = await import("@/lib/session.server");
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

      await db
        .update(user)
        .set({ onboardingCompleted: 1 })
        .where(eq(user.id, userId));

      return { success: true };
    } catch (error) {
      console.error("Error completing onboarding:", error);
      throw error;
    }
  });
