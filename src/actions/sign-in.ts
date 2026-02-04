"use server";

import { SignInFormSchema } from "@/constants";
import { getDb } from "@/db/d1";
import { user } from "@/db/auth-schema";
import { createSession } from "@/lib/session";
import { createHash } from "crypto";
import { eq } from "drizzle-orm";
import z from "zod";

type SignInResult = { success: true } | { success: false; error: string };

export async function signIn(
  values: z.infer<typeof SignInFormSchema>,
): Promise<SignInResult> {
  const db = await getDb();

  try {
    // Hash the provided password
    const hashedPassword = createHash("sha256")
      .update(values.password)
      .digest("hex");

    // Find user by email
    const users = await db
      .select()
      .from(user)
      .where(eq(user.email, values.email));

    if (users.length === 0) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    const foundUser = users[0];

    // Check if password matches
    if (foundUser.password !== hashedPassword) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Create session
    await createSession(foundUser.id, foundUser.email, foundUser.name);

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
}
