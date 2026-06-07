import { createHash } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import type z from "zod";
import type { SignInFormSchema } from "@/constants";
import { user } from "@/db/auth-schema";
import { getDb } from "@/db/d1";

type SignInResult = { success: true } | { success: false; error: string };

export const signIn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as z.infer<typeof SignInFormSchema>)
  .handler(async ({ data: values, context }): Promise<SignInResult> => {
    const { useAppSession } = await import("@/lib/session.server");
    const db = getDb(context);
    const session = await useAppSession();

    try {
      const hashedPassword = createHash("sha256")
        .update(values.password)
        .digest("hex");

      const users = await db
        .select()
        .from(user)
        .where(eq(user.username, values.username));

      if (users.length === 0) {
        return {
          success: false,
          error: "Invalid username or password",
        };
      }

      const foundUser = users[0];

      if (foundUser.password !== hashedPassword) {
        return {
          success: false,
          error: "Invalid username or password",
        };
      }

      await session.update({
        userId: foundUser.id,
        username: foundUser.username,
        name: foundUser.name,
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error("Error signing in:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An error occurred during sign in",
      };
    }
  });
