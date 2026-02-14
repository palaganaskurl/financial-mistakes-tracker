"use client";

import { Text, Stack, Flex, Box } from "@chakra-ui/react";
import { BlessingCategoryToLabelMap } from "@/constants";
import DateRangeFilter from "./date-range-filter";

interface Blessing {
  id: string;
  category: string;
  date: string;
  amount: number;
}

interface BlessingsListProps {
  blessings: Blessing[];
  totalAmount: number;
  hasFilter: boolean;
}

export default function BlessingsList({
  blessings,
  totalAmount,
  hasFilter,
}: BlessingsListProps) {
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
          Total Blessings {hasFilter ? "(Filtered)" : ""}
        </Text>
        <Text fontSize="lg" fontWeight="bold">
          {new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
          }).format(totalAmount)}
        </Text>
      </Box>

      <Stack gap={3}>
        {blessings.length > 0 ? (
          blessings.map((blessing) => (
            <Flex
              key={blessing.id}
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
                  BlessingCategoryToLabelMap[
                    blessing.category as keyof typeof BlessingCategoryToLabelMap
                  ]
                }
              </Text>
              <Text fontSize="sm" textAlign="right" flex={1}>
                {new Intl.DateTimeFormat("en-PH", {
                  dateStyle: "medium",
                }).format(new Date(blessing.date))}
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
                }).format(blessing.amount)}
              </Text>
            </Flex>
          ))
        ) : (
          <Text textAlign="center" color="gray.500" py={8}>
            No blessings found in this date range
          </Text>
        )}
      </Stack>
    </Stack>
  );
}
