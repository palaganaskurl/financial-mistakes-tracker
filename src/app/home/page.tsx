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
} from "grommet";
import { Schedule } from "grommet-icons";

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
        }}
        style={{ height: "calc(100vh - 72px)" }}
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
          <Card>
            <CardHeader pad="medium">Balance</CardHeader>
            <CardBody pad="medium">
              {new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: STARTING_BALANCE.currency,
              }).format(STARTING_BALANCE.amount)}
            </CardBody>
          </Card>
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
            Mistakes
          </Heading>
          <Text>View All</Text>
        </Box>
        <Box margin={{ top: "large" }}>
          <MistakesList />
        </Box>
      </Main>
      <BottomNav />
    </>
  );
}
