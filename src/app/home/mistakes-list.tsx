import { MistakeCategoryToLabelMap } from "@/constants";
import { getDb } from "@/db/d1";
import { financialDramaTable } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { Stack, Text, Flex, Box } from "@chakra-ui/react";
import React from "react";

export default async function MistakesList() {
  const db = await getDb();
  const mistakes = await db
    .select()
    .from(financialDramaTable)
    .where(eq(financialDramaTable.type, "mistake"))
    .orderBy(desc(financialDramaTable.date))
    .limit(5);

  console.log("Mistakes:", mistakes);

  return (
    <Stack gap={3}>
      {mistakes.map((mistake: any) => (
        <Flex
          key={mistake.id.toString()}
          justify="space-between"
          align="center"
          p={3}
          borderWidth="1px"
          borderRadius="md"
          borderColor="gray.200"
          _hover={{ bg: "gray.50" }}
        >
          <Text fontSize="sm" flex={1}>
            {MistakeCategoryToLabelMap[mistake.category]}
          </Text>
          <Text fontSize="sm" textAlign="right" flex={1}>
            {new Intl.DateTimeFormat("en-PH", {
              dateStyle: "medium",
            }).format(new Date(mistake.date))}
          </Text>
          <Text fontSize="sm" fontWeight="medium" textAlign="right" flex={1}>
            {new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
            }).format(mistake.amount)}
          </Text>
        </Flex>
      ))}
    </Stack>
  );
}
