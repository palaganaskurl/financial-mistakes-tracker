import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, sql, sum } from "drizzle-orm";
import { AlertCircle, Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { accountsTable } from "@/db/accounts-schema";
import { getDb } from "@/db/d1";
import { financialDramaTable, recurringTable } from "@/db/schema";
import BlessingsList from "./-blessings-list";
import FinancialDramaSkeleton from "./-financial-drama-skeleton";
import MistakesList from "./-mistakes-list";

const getHomeData = createServerFn({ method: "GET" }).handler(
  async ({ context }) => {
    const { useAppSession } = await import("@/lib/session.server");
    const session = await useAppSession();
    const userId = session.data.userId;

    if (!userId) {
      throw redirect({ to: "/" });
    }

    const db = getDb(context);

    const phtNow = new Date(Date.now() + 8 * 60 * 60 * 1000);
    const todayStr = `${phtNow.getUTCFullYear()}-${String(
      phtNow.getUTCMonth() + 1,
    ).padStart(2, "0")}-${String(phtNow.getUTCDate()).padStart(2, "0")}`;

    const accountsResult = await db
      .select({ total: sum(accountsTable.balance) })
      .from(accountsTable)
      .where(eq(accountsTable.user_id, userId));
    const totalBalance = Number(accountsResult[0]?.total ?? 0);

    const monthlyExpensesResult = await db
      .select({ total: sum(financialDramaTable.amount) })
      .from(financialDramaTable)
      .where(
        and(
          eq(financialDramaTable.type, "mistake"),
          eq(financialDramaTable.user_id, userId),
          sql`strftime('%Y-%m', ${financialDramaTable.date}) = strftime('%Y-%m', ${todayStr})`,
        ),
      );
    const monthlyExpenses = Number(monthlyExpensesResult[0]?.total ?? 0);

    const monthlyBlessingsResult = await db
      .select({ total: sum(financialDramaTable.amount) })
      .from(financialDramaTable)
      .where(
        and(
          eq(financialDramaTable.type, "blessing"),
          eq(financialDramaTable.user_id, userId),
          sql`strftime('%Y-%m', ${financialDramaTable.date}) = strftime('%Y-%m', ${todayStr})`,
        ),
      );
    const monthlyBlessings = Number(monthlyBlessingsResult[0]?.total ?? 0);

    const mistakes = await db
      .select()
      .from(financialDramaTable)
      .where(
        and(
          eq(financialDramaTable.type, "mistake"),
          eq(financialDramaTable.user_id, userId),
          sql`${financialDramaTable.date} <= ${todayStr}`,
        ),
      )
      .orderBy(desc(financialDramaTable.date))
      .limit(5);

    const blessings = await db
      .select()
      .from(financialDramaTable)
      .where(
        and(
          eq(financialDramaTable.type, "blessing"),
          eq(financialDramaTable.user_id, userId),
          sql`${financialDramaTable.date} <= ${todayStr}`,
        ),
      )
      .orderBy(desc(financialDramaTable.date))
      .limit(5);

    const allRecurring = await db
      .select()
      .from(recurringTable)
      .where(
        and(
          eq(recurringTable.user_id, userId),
          eq(recurringTable.is_active, true),
        ),
      );

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const windowEnd = new Date(today);
    windowEnd.setDate(windowEnd.getDate() + 7);

    const upcomingRecurring = allRecurring
      .filter((item) => {
        if (item.end_date) {
          const end = new Date(item.end_date);
          end.setHours(0, 0, 0, 0);
          if (end < today) return false;
        }
        const start = new Date(item.start_date);
        start.setHours(0, 0, 0, 0);
        const current = new Date(start);
        if (current > windowEnd) return false;
        while (current < today) {
          if (item.frequency === "weekly") {
            current.setDate(current.getDate() + 7);
          } else if (item.frequency === "monthly") {
            current.setMonth(current.getMonth() + 1);
          } else {
            current.setFullYear(current.getFullYear() + 1);
          }
        }
        return current <= windowEnd;
      })
      .map((item) => {
        const start = new Date(item.start_date);
        start.setHours(0, 0, 0, 0);
        const current = new Date(start);
        while (current < today) {
          if (item.frequency === "weekly") {
            current.setDate(current.getDate() + 7);
          } else if (item.frequency === "monthly") {
            current.setMonth(current.getMonth() + 1);
          } else {
            current.setFullYear(current.getFullYear() + 1);
          }
        }
        return { ...item, nextDue: current.toISOString().split("T")[0] };
      });

    const recentTransactions = await db
      .select({
        type: financialDramaTable.type,
        category: financialDramaTable.category,
        date: financialDramaTable.date,
      })
      .from(financialDramaTable)
      .where(
        and(
          eq(financialDramaTable.user_id, userId),
          sql`${financialDramaTable.date} >= date(${todayStr}, '-366 days')`,
          sql`${financialDramaTable.date} < ${todayStr}`,
        ),
      );

    const loggedSet = new Set(
      recentTransactions.map((t) => `${t.type}|${t.category}|${t.date}`),
    );

    const overdueRecurring = allRecurring.flatMap((item) => {
      const start = new Date(item.start_date);
      start.setHours(0, 0, 0, 0);
      if (start >= today) return [];

      if (item.end_date) {
        const end = new Date(item.end_date);
        end.setHours(0, 0, 0, 0);
        if (end < today) return [];
      }

      const current = new Date(start);
      let prevDue: Date | null = null;
      while (current < today) {
        prevDue = new Date(current);
        if (item.frequency === "weekly") {
          current.setDate(current.getDate() + 7);
        } else if (item.frequency === "monthly") {
          current.setMonth(current.getMonth() + 1);
        } else {
          current.setFullYear(current.getFullYear() + 1);
        }
      }

      if (!prevDue) return [];

      const prevDueStr = (prevDue as Date).toISOString().split("T")[0];
      if (loggedSet.has(`${item.type}|${item.category}|${prevDueStr}`))
        return [];

      return [{ ...item, lastDue: prevDueStr }];
    });

    return {
      totalBalance,
      monthlyExpenses,
      monthlyBlessings,
      mistakes,
      blessings,
      upcomingRecurring,
      overdueRecurring,
    };
  },
);

export const Route = createFileRoute("/home/")({
  loader: () => getHomeData(),
  pendingComponent: FinancialDramaSkeleton,
  component: HomePage,
});

function HomePage() {
  const {
    totalBalance,
    monthlyExpenses,
    monthlyBlessings,
    mistakes,
    blessings,
    upcomingRecurring,
    overdueRecurring,
  } = Route.useLoaderData();

  return (
    <div className="w-full px-4 md:px-6">
      <div className="flex flex-col gap-6 py-6">
        <div className="flex flex-col items-center gap-1 py-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Net Balance
          </p>
          <p
            className={`text-4xl font-bold tracking-tight ${
              totalBalance >= 0 ? "text-primary" : "text-destructive"
            }`}
          >
            {new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
            }).format(totalBalance)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="px-4 rounded-xl">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Mistakes
            </p>
            <p className="text-xl font-bold text-destructive flex items-center gap-1">
              <span className="text-base font-semibold">−</span>
              {new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP",
              }).format(monthlyExpenses)}
            </p>
          </Card>
          <Card className="px-4 rounded-xl">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Blessings
            </p>
            <p className="text-xl font-bold text-blessing flex items-center gap-1">
              <span className="text-base font-semibold">+</span>
              {new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP",
              }).format(monthlyBlessings)}
            </p>
          </Card>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Recent Mistakes
            </h2>
            <Link
              to="/home/mistakes"
              className="text-xs text-primary hover:underline"
            >
              View All
            </Link>
          </div>
          <MistakesList mistakes={mistakes} />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Recent Blessings
            </h2>
            <Link
              to="/home/blessings"
              className="text-xs text-primary hover:underline"
            >
              View All
            </Link>
          </div>
          <BlessingsList blessings={blessings} />
        </div>

        {overdueRecurring.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <AlertCircle size={12} className="text-warning" />
              Overdue
            </h2>
            <div className="flex flex-col gap-2">
              {overdueRecurring.map((item) => (
                <Card
                  key={item.id}
                  className="px-4 py-3 flex-row items-center justify-between gap-3 border-warning/40"
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-semibold text-sm truncate">
                      {item.name}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {item.frequency} · Due{" "}
                      {new Date(item.lastDue).toLocaleDateString("en-PH", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-bold shrink-0 ${
                      item.type === "mistake"
                        ? "text-destructive"
                        : "text-blessing"
                    }`}
                  >
                    {item.type === "mistake" ? "-" : "+"}
                    {new Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: "PHP",
                    }).format(item.amount)}
                  </span>
                </Card>
              ))}
            </div>
          </div>
        )}

        {upcomingRecurring.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Bell size={12} />
                Upcoming (Next 7 Days)
              </h2>
              <Link
                to="/home/budgets"
                className="text-xs text-primary hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {upcomingRecurring.map((item) => (
                <Card
                  key={item.id}
                  className="px-4 py-3 flex-row items-center justify-between gap-3"
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-semibold text-sm truncate">
                      {item.name}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {item.frequency} · Due{" "}
                      {new Date(item.nextDue) <=
                      new Date(new Date().setHours(0, 0, 0, 0))
                        ? "today"
                        : new Date(item.nextDue).toLocaleDateString("en-PH", {
                            month: "short",
                            day: "numeric",
                          })}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-bold shrink-0 ${item.type === "mistake" ? "text-destructive" : "text-blessing"}`}
                  >
                    {item.type === "mistake" ? "-" : "+"}
                    {new Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: "PHP",
                    }).format(item.amount)}
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
