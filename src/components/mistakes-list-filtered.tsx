"use client";

import { Text, Stack, Flex, Box } from "@chakra-ui/react";
import { MistakeCategoryToLabelMap } from "@/constants";
import DateRangeFilter from "./date-range-filter";

interface Mistake {
  id: string;
  category: string;
  date: string;
  amount: number;
}

interface MistakesListProps {
  mistakes: Mistake[];
  totalAmount: number;
  hasFilter: boolean;
}

export default function MistakesList({
  mistakes,
  totalAmount,
  hasFilter,
}: MistakesListProps) {
  return (
    <Stack gap={4}>
      <DateRangeFilter />

      <Box
        borderWidth="1px"
        borderRadius="lg"
        p={4}
        borderColor="gray.200"
        bg="gray.50"
        _dark={{ bg: "gray.900" }}
      >
        <Text fontSize="sm" fontWeight="medium" mb={2}>
          Total Mistakes {hasFilter ? "(Filtered)" : ""}
        </Text>
        <Text fontSize="lg" fontWeight="bold">
          {new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
          }).format(totalAmount)}
        </Text>
      </Box>

      <Stack gap={3}>
        {mistakes.length > 0 ? (
          mistakes.map((mistake) => (
            <Flex
              key={mistake.id}
              justify="space-between"
              align="center"
              p={3}
              borderWidth="1px"
              borderRadius="md"
              borderColor="gray.200"
              _hover={{ bg: "gray.100", _dark: { bg: "gray.700" } }}
            >
              <Text fontSize="sm" flex={1}>
                {
                  MistakeCategoryToLabelMap[
                    mistake.category as keyof typeof MistakeCategoryToLabelMap
                  ]
                }
              </Text>
              <Text fontSize="sm" textAlign="right" flex={1}>
                {new Intl.DateTimeFormat("en-PH", {
                  dateStyle: "medium",
                }).format(new Date(mistake.date))}
              </Text>
              <Text
                fontSize="sm"
                fontWeight="medium"
                textAlign="right"
                flex={1}
              >
                {new Intl.NumberFormat("en-PH", {
                  style: "currency",
                  currency: "PHP",
                }).format(mistake.amount)}
              </Text>
            </Flex>
          ))
        ) : (
          <Text textAlign="center" color="gray.500" py={8}>
            No mistakes found in this date range
          </Text>
        )}
      </Stack>
    </Stack>
  );
}
