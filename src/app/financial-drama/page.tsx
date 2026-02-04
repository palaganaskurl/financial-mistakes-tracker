import AddFinancialDramaForm from "@/app/financial-drama/add-financial-drama-form";
import BottomNav from "@/components/custom/bottom-nav";
import { Box, Heading, Container, VStack } from "@chakra-ui/react";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

/**
 * TODOs:
 * - Add account selection for multi-account support.
 * - Update categories.
 */
export default async function AddFinancialDramaPage() {
  const session = await getSession();

  if (!session.isLoggedIn) {
    redirect("/");
  }

  const userId = session.userId!;

  return (
    <>
      <Box
        as="main"
        px={{ base: 4, md: 8 }}
        pb={{ base: "80px", md: 0 }}
        minH="calc(100dvh - 72px)"
      >
        <Container maxW="container.md" py={8}>
          <VStack align="start" gap={6}>
            <Heading as="h1" size="lg">
              Add Financial Drama
            </Heading>
            <Box width="100%">
              <AddFinancialDramaForm userId={userId} />
            </Box>
          </VStack>
        </Container>
      </Box>
      <BottomNav />
    </>
  );
}
