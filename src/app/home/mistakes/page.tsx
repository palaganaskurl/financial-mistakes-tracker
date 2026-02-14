import { getDb } from "@/db/d1";
import { financialDramaTable } from "@/db/schema";
import { desc, eq, and, gte, lte } from "drizzle-orm";
import { Stack, Flex, Container, Heading, Button } from "@chakra-ui/react";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import MistakesList from "@/components/mistakes-list-filtered";

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function AllMistakesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const startDate = params.startDate;
  const endDate = params.endDate;

  const db = await getDb();

  const conditions = [eq(financialDramaTable.type, "mistake")];

  if (startDate) {
    conditions.push(gte(financialDramaTable.date, startDate));
  }
  if (endDate) {
    conditions.push(lte(financialDramaTable.date, endDate));
  }

  const mistakes = await db
    .select()
    .from(financialDramaTable)
    .where(and(...conditions))
    .orderBy(desc(financialDramaTable.date));

  const totalAmount = mistakes.reduce(
    (sum, mistake) => sum + mistake.amount,
    0,
  );

  return (
    <Container maxW="full" px={{ base: 4, md: 6 }} pb={{ base: 20, md: 6 }}>
      <Stack gap={6} py={6}>
        <Flex align="center" gap={3}>
          <Link href="/home">
            <Button
              variant="ghost"
              size="sm"
              p={2}
              display="flex"
              alignItems="center"
            >
              <IoArrowBack size={20} />
            </Button>
          </Link>
          <Heading as="h1" size="lg">
            All Mistakes
          </Heading>
        </Flex>

        <MistakesList
          mistakes={mistakes}
          totalAmount={totalAmount}
          hasFilter={!!startDate || !!endDate}
        />
      </Stack>
    </Container>
  );
}
