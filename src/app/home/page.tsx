import { CalendarDays } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BottomNav from "@/components/ui/bottom-nav";

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
    <div className="container mx-auto p-4">
      <div className="flex gap-2 items-center">
        <CalendarDays />
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {currentMonth} {currentYear}
        </h3>
      </div>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Balance</CardTitle>
          <CardDescription>
            {new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: STARTING_BALANCE.currency,
            }).format(STARTING_BALANCE.amount)}
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Forecasted Balance From Mistakes By Date</CardTitle>
          <CardDescription>
            {new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: STARTING_BALANCE.currency,
            }).format(STARTING_BALANCE.amount)}
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="mt-4">
        <div>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Mistakes
          </h4>
        </div>
        <div></div>
      </div>
      <BottomNav />
    </div>
  );
}
