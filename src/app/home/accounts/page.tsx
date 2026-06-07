import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getDb } from "@/db/d1";
import { accountsTable } from "@/db/accounts-schema";
import { eq } from "drizzle-orm";
import {
  Box,
  Container,
  Heading,
  Stack,
  Button,
  Flex,
  Text,
} from "@chakra-ui/react";
import { IoArrowBack } from "react-icons/io5";
import Link from "next/link";
import AddAccountForm from "./add-account-form";
import BottomNav from "@/components/custom/bottom-nav";

export default async function AccountsPage() {
  const session = await getSession();

  if (!session.isLoggedIn) {
    redirect("/");
  }

  const db = getDb();
  const accounts = await db
    .select()
    .from(accountsTable)
    .where(eq(accountsTable.user_id, session.userId));

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

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
            <Link href="/home">
              <Button variant="ghost" size="sm" p={0}>
                <IoArrowBack size={24} />
              </Button>
            </Link>
            <Heading as="h1" size="lg">
              Accounts
            </Heading>
          </Flex>

          {/* Total Balance */}
          <Box borderWidth="1px" borderRadius="lg" p={4} borderColor="gray.200">
            <Text fontSize="sm" fontWeight="medium" mb={2}>
              Total Balance
            </Text>
            <Text fontSize="2xl" fontWeight="bold">
              {new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP",
              }).format(totalBalance)}
            </Text>
          </Box>

          {/* Accounts List */}
          {accounts.length > 0 && (
            <Stack gap={3}>
              <Text fontSize="sm" fontWeight="semibold">
                Your Accounts
              </Text>
              {accounts.map((account) => (
                <Box
                  key={account.id}
                  borderWidth="1px"
                  borderRadius="lg"
                  p={4}
                  borderColor="gray.200"
                >
                  <Flex justify="space-between" align="start" mb={2}>
                    <Stack gap={0}>
                      <Text fontWeight="semibold">{account.name}</Text>
                      <Text
                        fontSize="sm"
                        color="gray.600"
                        textTransform="capitalize"
                      >
                        {account.type.replace("_", " ")}
                      </Text>
                    </Stack>
                    <Text fontWeight="bold">
                      {new Intl.NumberFormat("en-PH", {
                        style: "currency",
                        currency: account.currency,
                      }).format(account.balance)}
                    </Text>
                  </Flex>
                </Box>
              ))}
            </Stack>
          )}

          {/* Add Account Form */}
          <Box borderWidth="1px" borderRadius="lg" p={4} borderColor="gray.200">
            <Text fontSize="sm" fontWeight="semibold" mb={4}>
              Add New Account
            </Text>
            <AddAccountForm />
          </Box>
        </Stack>
      </Container>
      <BottomNav />
    </>
  );
}
