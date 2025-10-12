import AddFinancialDramaForm from "@/app/financial-drama/add-financial-drama-form";
import BottomNav from "@/components/custom/bottom-nav";
import { auth } from "@/lib/auth";
import { Box, Heading, Main, PageHeader } from "grommet";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * TODOs:
 * - Add account selection for multi-account support.
 * - Update categories.
 */
export default async function AddFinancialDramaPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <>
      <Main
        pad={{
          horizontal: "large",
        }}
        style={{ height: "calc(100dvh - 72px)" }}
      >
        <PageHeader
          title={
            <Box direction="row" align="center" gap="small">
              <Heading size="medium">Add Financial Drama</Heading>
            </Box>
          }
        />
        <Box>
          <AddFinancialDramaForm userId={session.user.id} />
        </Box>
      </Main>
      <BottomNav />
    </>
  );
}
