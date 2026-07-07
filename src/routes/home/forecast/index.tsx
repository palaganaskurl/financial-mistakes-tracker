import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { ArrowLeft, TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { accountsTable } from "@/db/accounts-schema";
import { getDb } from "@/db/d1";
import { recurringTable } from "@/db/schema";

const getForecastData = createServerFn({ method: "GET" }).handler(
  async ({ context }) => {
    const { useAppSession } = await import("@/lib/session.server");
    const session = await useAppSession();
    if (!session.data.userId) throw redirect({ to: "/" });

    const db = getDb(context);
    const [recurringItems, accounts] = await Promise.all([
      db
        .select()
        .from(recurringTable)
        .where(
          and(
            eq(recurringTable.user_id, session.data.userId),
            eq(recurringTable.is_active, true),
          ),
        ),
      db
        .select()
        .from(accountsTable)
        .where(eq(accountsTable.user_id, session.data.userId)),
    ]);

    return { recurringItems, accounts };
  },
);

export const Route = createFileRoute("/home/forecast/")({
  loader: () => getForecastData(),
  component: ForecastPage,
});

type RecurringItem = Awaited<
  ReturnType<typeof getForecastData>
>["recurringItems"][number];

type Account = Awaited<ReturnType<typeof getForecastData>>["accounts"][number];

function occurrencesInMonth(
  item: RecurringItem,
  year: number,
  month: number,
): number {
  const monthStart = new Date(year, month, 1);
  monthStart.setHours(0, 0, 0, 0);
  const monthEnd = new Date(year, month + 1, 0);
  monthEnd.setHours(23, 59, 59, 999);

  const start = new Date(item.start_date);
  start.setHours(0, 0, 0, 0);

  if (start > monthEnd) return 0;

  if (item.end_date) {
    const end = new Date(item.end_date);
    end.setHours(0, 0, 0, 0);
    if (end < monthStart) return 0;
  }

  let count = 0;
  const current = new Date(start);

  while (current <= monthEnd) {
    if (current >= monthStart) count++;
    if (item.frequency === "weekly") {
      current.setDate(current.getDate() + 7);
    } else if (item.frequency === "monthly") {
      current.setMonth(current.getMonth() + 1);
    } else {
      current.setFullYear(current.getFullYear() + 1);
    }
    if (count > 52) break;
  }

  return count;
}

function computeMonthForecast(
  items: RecurringItem[],
  year: number,
  month: number,
) {
  let income = 0;
  let expenses = 0;
  const breakdown: Array<{
    item: RecurringItem;
    count: number;
    total: number;
  }> = [];

  for (const item of items) {
    const count = occurrencesInMonth(item, year, month);
    if (count === 0) continue;
    const total = item.amount * count;
    if (item.type === "blessing") income += total;
    else expenses += total;
    breakdown.push({ item, count, total });
  }

  return { income, expenses, net: income - expenses, breakdown };
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
}

function ForecastCard({
  subtitle,
  title,
  income,
  expenses,
  net,
  projectedBalance,
  breakdown,
}: {
  subtitle: string;
  title: string;
  income: number;
  expenses: number;
  net: number;
  projectedBalance: number;
  breakdown: Array<{ item: RecurringItem; count: number; total: number }>;
}) {
  const blessings = breakdown.filter((b) => b.item.type === "blessing");
  const mistakes = breakdown.filter((b) => b.item.type === "mistake");

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {subtitle}
        </p>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="px-4 py-3 flex flex-col gap-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Expected Income
          </p>
          <p className="text-lg font-bold text-blessing">
            {formatCurrency(income)}
          </p>
        </Card>
        <Card className="px-4 py-3 flex flex-col gap-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Expected Expenses
          </p>
          <p className="text-lg font-bold text-destructive">
            {formatCurrency(expenses)}
          </p>
        </Card>
      </div>

      <Card className="px-4 py-3 flex-row items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Net Change
          </p>
          <p
            className={`text-lg font-bold ${net >= 0 ? "text-blessing" : "text-destructive"}`}
          >
            {net >= 0 ? "+" : ""}
            {formatCurrency(net)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Projected Balance
          </p>
          <p
            className={`text-lg font-bold ${projectedBalance < 0 ? "text-destructive" : ""}`}
          >
            {formatCurrency(projectedBalance)}
          </p>
        </div>
      </Card>

      {breakdown.length > 0 && (
        <div className="flex flex-col gap-2">
          {blessings.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <TrendingUp size={11} />
                Income
              </p>
              {blessings.map(({ item, count, total }) => (
                <Card
                  key={item.id}
                  className="px-4 py-2.5 flex-row items-center justify-between gap-2"
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm font-semibold truncate">
                      {item.name}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {item.frequency}
                      {count > 1 ? ` × ${count}` : ""}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-blessing shrink-0">
                    +{formatCurrency(total)}
                  </span>
                </Card>
              ))}
            </div>
          )}
          {mistakes.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <TrendingDown size={11} />
                Expenses
              </p>
              {mistakes.map(({ item, count, total }) => (
                <Card
                  key={item.id}
                  className="px-4 py-2.5 flex-row items-center justify-between gap-2"
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm font-semibold truncate">
                      {item.name}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {item.frequency}
                      {count > 1 ? ` × ${count}` : ""}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-destructive shrink-0">
                    -{formatCurrency(total)}
                  </span>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {breakdown.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No recurring items this month.
        </p>
      )}
    </div>
  );
}

function ForecastPage() {
  const { recurringItems, accounts } = Route.useLoaderData();

  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth();
  const nextYear = thisMonth === 11 ? thisYear + 1 : thisYear;
  const nextMonth = (thisMonth + 1) % 12;

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  const thisForecast = computeMonthForecast(
    recurringItems,
    thisYear,
    thisMonth,
  );
  const nextForecast = computeMonthForecast(
    recurringItems,
    nextYear,
    nextMonth,
  );

  const thisMonthProjected = totalBalance + thisForecast.net;
  const nextMonthProjected = totalBalance + thisForecast.net + nextForecast.net;

  const thisMonthLabel = now.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
  const nextMonthLabel = new Date(nextYear, nextMonth, 1).toLocaleString(
    "en-US",
    { month: "long", year: "numeric" },
  );

  return (
    <div className="w-full px-4 md:px-6 pb-20 md:pb-6 h-[calc(100dvh-72px)] overflow-y-auto">
      <div className="flex flex-col gap-8 py-6">
        <div className="flex items-center gap-3">
          <Link to="/home">
            <button
              type="button"
              className="p-1 hover:opacity-70 transition-opacity"
            >
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Recurring
            </p>
            <h1 className="text-2xl font-bold tracking-tight">Forecast</h1>
          </div>
        </div>

        <ForecastCard
          subtitle="This Month"
          title={thisMonthLabel}
          income={thisForecast.income}
          expenses={thisForecast.expenses}
          net={thisForecast.net}
          projectedBalance={thisMonthProjected}
          breakdown={thisForecast.breakdown}
        />

        <ForecastCard
          subtitle="Next Month"
          title={nextMonthLabel}
          income={nextForecast.income}
          expenses={nextForecast.expenses}
          net={nextForecast.net}
          projectedBalance={nextMonthProjected}
          breakdown={nextForecast.breakdown}
        />

        {accounts.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Current Account Balances
            </h2>
            <div className="flex flex-col gap-2">
              {(accounts as Account[]).map((account) => (
                <Card
                  key={account.id}
                  className="px-4 py-3 flex-row items-center justify-between"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-sm">
                      {account.name}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {account.type.replace(/_/g, " ")}
                    </span>
                  </div>
                  <span className="text-sm font-bold">
                    {formatCurrency(account.balance)}
                  </span>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
