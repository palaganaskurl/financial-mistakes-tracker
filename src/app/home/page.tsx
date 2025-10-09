import BottomNav from "@/components/custom/bottom-nav";
import MistakesList from "./mistakes-list";
import {
  Main,
  PageHeader,
  Heading,
  Box,
  Card,
  CardHeader,
  CardBody,
  Text,
  Skeleton,
} from "grommet";
import { Schedule } from "grommet-icons";
import { Suspense } from "react";
import CurrentBalance from "./current-balance";
import FinancialDramaSkeleton from "./financial-drama-skeleton";
import BlessingsList from "./blessings-list";

const STARTING_BALANCE = {
  amount: 100000,
  currency: "PHP",
  date: new Date("2025-08-01"),
};

// const PLANNED_MISTAKES = [
//   {
//     date: new Date("2025-08-05"),
//     description: "House Rent",
//     details: "The monthly rent for the apartment is due.",
//   },
//   {
//     date: new Date("2025-08-07"),
//     description: "Internet Bill",
//     details: "The monthly internet bill is due.",
//   },
// ];

export default function HomePage() {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("en-US", { month: "long" });
  const currentYear = currentDate.getFullYear();

  return (
    <>
      <Main
        pad={{
          horizontal: "large",
          bottom: "large",
        }}
        style={{ height: "calc(100dvh - 72px)" }}
      >
        <PageHeader
          title={
            <Box direction="row" align="center" gap="medium">
              <Schedule size="large" color="black" />
              <Heading size="medium">
                {currentMonth} {currentYear}
              </Heading>
            </Box>
          }
        />
        <Box gap="medium">
          <CurrentBalance />
          <Card>
            <CardHeader pad="medium">
              Forecasted Balance From Mistakes By Date
            </CardHeader>
            <CardBody pad="medium">
              {new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: STARTING_BALANCE.currency,
              }).format(STARTING_BALANCE.amount)}
            </CardBody>
          </Card>
        </Box>
        <Box
          margin={{ top: "large" }}
          direction="row"
          align="center"
          justify="between"
        >
          <Heading margin="none" size="small">
            Recent Mistakes
          </Heading>
          <Text>View All</Text>
        </Box>
        <Box margin={{ top: "large" }}>
          <Suspense fallback={<FinancialDramaSkeleton />}>
            <MistakesList />
          </Suspense>
        </Box>
        <Box
          margin={{ top: "large" }}
          direction="row"
          align="center"
          justify="between"
        >
          <Heading margin="none" size="small">
            Recent Blessings
          </Heading>
          <Text>View All</Text>
        </Box>
        <Box margin={{ top: "large" }}>
          <Suspense fallback={<FinancialDramaSkeleton />}>
            <BlessingsList />
          </Suspense>
        </Box>
      </Main>
      <BottomNav />
    </>
  );
}
