"use client";

import AddFinancialDramaForm from "@/app/financial-drama/add-financial-drama-form";
import BottomNav from "@/components/custom/bottom-nav";

import { Box, Heading, Main, PageHeader } from "grommet";

/**
 * TODOs:
 * - Add account selection for multi-account support.
 * - Update categories.
 */
export default function AddFinancialDramaPage() {
  return (
    <>
      <Main pad="large" style={{ height: "calc(100vh - 72px)" }}>
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
