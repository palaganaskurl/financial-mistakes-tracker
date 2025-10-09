"use client";

import AddFinancialDramaForm from "@/app/financial-drama/add-financial-drama-form";
import BottomNav from "@/components/custom/bottom-nav";
import { Box, Heading, Main, PageHeader } from "grommet";

// TODO: Remove this once we have auth
export const dynamic = "force-dynamic";

/**
 * TODOs:
 * - Add account selection for multi-account support.
 * - Update categories.
 */
export default function AddFinancialDramaPage() {
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
          <AddFinancialDramaForm />
        </Box>
      </Main>
      <BottomNav />
    </>
  );
}
