import BottomNav from "@/components/custom/bottom-nav";
import MistakesList from "./mistakes-list";
import {
  Main,
  PageHeader,
  Button,
  Heading,
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "grommet";
import { Favorite, ShareOption, Schedule } from "grommet-icons";

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
      <Main pad="large" style={{ height: "calc(100vh - 72px)" }}>
        <PageHeader
          title={
            <Box direction="row" align="center" gap="small">
              <Schedule size="medium" />
              <Heading size="medium">
                {currentMonth} {currentYear}
              </Heading>
            </Box>
          }
        />
        <Card height="small" background="light-1">
          <CardHeader pad="medium">Balance</CardHeader>
          <CardBody pad="medium">
            {new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: STARTING_BALANCE.currency,
            }).format(STARTING_BALANCE.amount)}
          </CardBody>
          <CardFooter pad={{ horizontal: "small" }} background="light-2">
            <Button icon={<Favorite color="red" />} hoverIndicator />
            <Button icon={<ShareOption color="plain" />} hoverIndicator />
          </CardFooter>
        </Card>
        <Card height="small" background="light-1">
          <CardHeader pad="medium">
            Forecasted Balance From Mistakes By Date
          </CardHeader>
          <CardBody pad="medium">
            {new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: STARTING_BALANCE.currency,
            }).format(STARTING_BALANCE.amount)}
          </CardBody>
          <CardFooter pad={{ horizontal: "small" }} background="light-2">
            <Button icon={<Favorite color="red" />} hoverIndicator />
            <Button icon={<ShareOption color="plain" />} hoverIndicator />
          </CardFooter>
        </Card>
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                Mistakes
              </h4>
            </div>
            <div className="font-bold">View All</div>
          </div>
          <div className="mt-4">
            <MistakesList />
          </div>
        </div>
      </Main>
      <BottomNav />
    </>
  );
}
