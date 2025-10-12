import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "@/db/postgres";
import * as authSchema from "@/db/auth-schema";
import { MAX_PASSWORD_LENGTH } from "@/constants";

export const auth = betterAuth({
  database: drizzleAdapter(getDb(), {
    provider: "pg",
    schema: authSchema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: MAX_PASSWORD_LENGTH,
    autoSignIn: true,
  },
  emailVerification: {
    sendOnSignUp: false,
  },
});
