import { BlessingCategoryToLabelMap } from "@/constants";
import { getDb } from "@/db/d1";
import { financialDramaTable } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { Stack, Text, Flex, Box } from "@chakra-ui/react";
import React from "react";

export default async function BlessingsList() {
  const db = await getDb();
  const blessings = await db
    .select()
    .from(financialDramaTable)
    .where(eq(financialDramaTable.type, "blessing"))
    .orderBy(desc(financialDramaTable.date))
    .limit(5);

  return (
    <Stack gap={3}>
      {blessings.map((blessing: any) => (
        <Flex
          key={blessing.id.toString()}
          justify="space-between"
          align="center"
          p={3}
          borderWidth="1px"
          borderRadius="md"
          borderColor="gray.200"
          _hover={{ bg: "gray.50" }}
        >
          <Text fontSize="sm" flex={1}>
            {BlessingCategoryToLabelMap[blessing.category]}
          </Text>
          <Text fontSize="sm" textAlign="right" flex={1}>
            {new Intl.DateTimeFormat("en-PH", {
              dateStyle: "medium",
            }).format(blessing.date)}
          </Text>
          <Text fontSize="sm" fontWeight="medium" textAlign="right" flex={1}>
            {new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
            }).format(blessing.amount)}
          </Text>
        </Flex>
      ))}
    </Stack>
  );
}
