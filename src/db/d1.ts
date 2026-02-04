import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { schema } from "@/db/schema";

export const getDb = async () => {
  const { env } = await getCloudflareContext({ async: true });

  return drizzle(env.FINANCIAL_MISTAKES_TRACKER_D1, {
    schema: schema,
    logger: process.env.NODE_ENV === "development",
  });
};
