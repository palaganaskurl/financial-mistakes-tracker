import { drizzle } from "drizzle-orm/d1";
import { schema } from "@/db/schema";

type CloudflareEnv = {
  FINANCIAL_MISTAKES_TRACKER_D1?: any;
};

let env: CloudflareEnv | null = null;

const loadEnv = async () => {
  if (env !== null) return env;
  try {
    const imported = await import("cloudflare:workers");
    env = imported.env || {};
  } catch {
    env = {};
  }
  return env;
};

export const getDb = (context?: any) => {
  // When called with context (server handlers), use context directly
  if (context?.cloudflare?.env?.FINANCIAL_MISTAKES_TRACKER_D1) {
    return drizzle(context.cloudflare.env.FINANCIAL_MISTAKES_TRACKER_D1, {
      schema,
      logger: process.env.NODE_ENV === "development",
    });
  }

  // For other cases, try to use the global env
  if (env?.FINANCIAL_MISTAKES_TRACKER_D1) {
    return drizzle(env.FINANCIAL_MISTAKES_TRACKER_D1, {
      schema,
      logger: process.env.NODE_ENV === "development",
    });
  }

  // Fallback: return a drizzle instance even if DB isn't configured
  // This allows the app to load during dev without hard failing
  return drizzle({} as any, {
    schema,
    logger: process.env.NODE_ENV === "development",
  });
};

// Initialize env on module load
loadEnv().catch(() => {
  /* fail silently during dev */
});
