"use client";

import { useCallback, useState } from "react";
import { Button, Stack, Box, Text } from "@chakra-ui/react";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { useRouter, useSearchParams } from "next/navigation";

function getFirstDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getLastDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export default function DateRangeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");

  const today = new Date();
  const defaultStartDate = getFirstDayOfMonth(today);
  const defaultEndDate = getLastDayOfMonth(today);

  const [selectedDates, setSelectedDates] = useState<Date[]>(
    startDateParam && endDateParam
      ? [new Date(startDateParam), new Date(endDateParam)]
      : [defaultStartDate, defaultEndDate],
  );

  const handleDateChange = useCallback(
    (dates: Date[]) => {
      setSelectedDates(dates);
      if (dates.length === 2) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("startDate", dates[0].toISOString().split("T")[0]);
        params.set("endDate", dates[1].toISOString().split("T")[0]);
        router.push(`?${params.toString()}`);
      }
    },
    [router, searchParams],
  );

  const handleClear = useCallback(() => {
    setSelectedDates([]);
    router.push("");
  }, [router]);

  return (
    <Stack
      gap={3}
      p={4}
      borderWidth="1px"
      borderRadius="md"
      borderColor="gray.200"
      bg="gray.50"
      _dark={{ bg: "gray.900", borderColor: "gray.700" }}
    >
      <Box>
        <Text fontSize="sm" mb={3} fontWeight="medium">
          Date Range
        </Text>
        <RangeDatepicker
          selectedDates={selectedDates}
          onDateChange={handleDateChange}
          propsConfigs={{
            inputProps: {
              size: "sm",
              placeholder: "Select date range",
            },
          }}
        />
      </Box>
      {selectedDates.length === 2 && (
        <Button onClick={handleClear} variant="outline" size="sm" w="full">
          Clear
        </Button>
      )}
    </Stack>
  );
}
