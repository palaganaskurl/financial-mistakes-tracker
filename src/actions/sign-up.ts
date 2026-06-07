import { createServerFn } from "@tanstack/react-start";
import { getDb } from "@/db/d1";
import { SignUpFormSchema } from "@/constants";
import { user } from "@/db/auth-schema";
import z from "zod";
import { createHash } from "crypto";
import { eq } from "drizzle-orm";

export const signUp = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as z.infer<typeof SignUpFormSchema>)
  .handler(async ({ data: values, context }) => {
    const db = getDb(context);

    try {
      const existingUser = await db
        .select()
        .from(user)
        .where(eq(user.username, values.username));

      if (existingUser.length > 0) {
        return {
          success: false,
          error: "Username already taken",
        };
      }

      const hashedPassword = createHash("sha256")
        .update(values.password)
        .digest("hex");

      await db.insert(user).values({
        username: values.username,
        name: values.name,
        password: hashedPassword,
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error("Error signing up:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An error occurred during sign up",
      };
    }
  });
