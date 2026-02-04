"use server";

import { SignUpFormSchema } from "@/constants";
import { getDb } from "@/db/d1";
import { user } from "@/db/auth-schema";
import z from "zod";
import { createHash } from "crypto";
import { eq } from "drizzle-orm";

type SignUpResult = { success: true } | { success: false; error: string };

export async function signUp(
  values: z.infer<typeof SignUpFormSchema>,
): Promise<SignUpResult> {
  const db = await getDb();

  try {
    // Check if email already exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, values.email));

    if (existingUser.length > 0) {
      return {
        success: false,
        error: "Email already registered",
      };
    }

    // Hash password
    const hashedPassword = createHash("sha256")
      .update(values.password)
      .digest("hex");

    // Create user
    await db.insert(user).values({
      email: values.email,
      password: hashedPassword,
      name: values.name,
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
}
