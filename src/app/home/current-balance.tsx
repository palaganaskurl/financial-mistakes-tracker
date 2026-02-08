import { getDb } from "@/db/d1";
import { sql } from "drizzle-orm";
import { Box, Text } from "@chakra-ui/react";
import Link from "next/link";

export default async function CurrentBalance() {
  const db = await getDb();

  const rows = (await db.run(
    sql`SELECT SUM(CASE WHEN type = 'blessing' THEN amount ELSE -amount END) AS balance FROM "financialDrama" WHERE date <= datetime('now')`,
  )) as { results?: Array<{ balance: number }> };
  const currentBalance = (rows.results?.[0]?.balance as number) ?? 0;

  return (
    <Link href="/home/accounts">
      <Box
        borderWidth="1px"
        borderRadius="lg"
        p={4}
        borderColor="gray.200"
        cursor="pointer"
        transition="all 0.2s"
        _hover={{
          borderColor: "blue.400",
          boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.1)",
        }}
      >
        <Text fontSize="sm" fontWeight="medium" mb={2}>
          Balance
        </Text>
        <Text fontSize="lg" fontWeight="bold">
          {new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
          }).format(currentBalance)}
        </Text>
      </Box>
    </Link>
  );
}
