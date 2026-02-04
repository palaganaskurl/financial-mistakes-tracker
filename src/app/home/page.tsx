import BottomNav from "@/components/custom/bottom-nav";
import MistakesList from "./mistakes-list";
import { Suspense } from "react";
import CurrentBalance from "./current-balance";
import FinancialDramaSkeleton from "./financial-drama-skeleton";
import BlessingsList from "./blessings-list";
import { Box, Container, Heading, Stack, Text, Flex } from "@chakra-ui/react";
import { IoCalendarOutline } from "react-icons/io5";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

const STARTING_BALANCE = {
  amount: 100000,
  currency: "PHP",
  date: new Date("2025-08-01"),
};

export default async function HomePage() {
  const session = await getSession();

  if (!session.isLoggedIn) {
    redirect("/");
  }

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("en-US", { month: "long" });
  const currentYear = currentDate.getFullYear();

  return (
    <>
      <Container
        maxW="full"
        px={{ base: 4, md: 6 }}
        pb={{ base: 20, md: 6 }}
        h="calc(100dvh - 72px)"
        overflowY="auto"
      >
        <Stack gap={6} py={6}>
          <Flex align="center" gap={3}>
            <IoCalendarOutline size={24} />
            <Heading as="h1" size="lg">
              {currentMonth} {currentYear}
            </Heading>
          </Flex>
          <Stack gap={4}>
            <CurrentBalance />
            <Box
              borderWidth="1px"
              borderRadius="lg"
              p={4}
              borderColor="gray.200"
            >
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Forecasted Balance From Mistakes By Date
              </Text>
              <Text fontSize="lg" fontWeight="bold">
                {new Intl.NumberFormat("en-PH", {
                  style: "currency",
                  currency: STARTING_BALANCE.currency,
                }).format(STARTING_BALANCE.amount)}
              </Text>
            </Box>
          </Stack>

          <Stack gap={4} mt={6}>
            <Flex justify="space-between" align="center">
              <Heading as="h2" size="md">
                Recent Mistakes
              </Heading>
              <Text
                fontSize="sm"
                cursor="pointer"
                _hover={{ textDecoration: "underline" }}
              >
                View All
              </Text>
            </Flex>
            <Suspense fallback={<FinancialDramaSkeleton />}>
              <MistakesList />
            </Suspense>
          </Stack>

          <Stack gap={4} mt={6}>
            <Flex justify="space-between" align="center">
              <Heading as="h2" size="md">
                Recent Blessings
              </Heading>
              <Text
                fontSize="sm"
                cursor="pointer"
                _hover={{ textDecoration: "underline" }}
              >
                View All
              </Text>
            </Flex>
            <Suspense fallback={<FinancialDramaSkeleton />}>
              <BlessingsList />
            </Suspense>
          </Stack>
        </Stack>
      </Container>
      <BottomNav />
    </>
  );
}
