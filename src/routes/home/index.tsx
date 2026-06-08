import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, sql, sum } from "drizzle-orm";
import { Card } from "@/components/ui/card";
import { accountsTable } from "@/db/accounts-schema";
import { getDb } from "@/db/d1";
import { financialDramaTable } from "@/db/schema";
import BlessingsList from "./-blessings-list";
import CurrentBalance from "./-current-balance";
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
          sql`strftime('%Y-%m', ${financialDramaTable.date}) = strftime('%Y-%m', 'now')`,
        ),
      );
    const monthlyExpenses = Number(monthlyExpensesResult[0]?.total ?? 0);

    const mistakes = await db
      .select()
      .from(financialDramaTable)
      .where(
        and(
          eq(financialDramaTable.type, "mistake"),
          eq(financialDramaTable.user_id, userId),
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
        ),
      )
      .orderBy(desc(financialDramaTable.date))
      .limit(5);

    return { totalBalance, monthlyExpenses, mistakes, blessings };
  },
);

export const Route = createFileRoute("/home/")({
  loader: () => getHomeData(),
  pendingComponent: FinancialDramaSkeleton,
  component: HomePage,
});

function HomePage() {
  const { totalBalance, monthlyExpenses, mistakes, blessings } =
    Route.useLoaderData();

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("en-US", { month: "long" });
  const currentYear = currentDate.getFullYear();

  return (
    <div className="w-full px-4 md:px-6 pb-20 md:pb-6 h-[calc(100dvh-72px)] overflow-y-auto">
      <div className="flex flex-col gap-6 py-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            Financial Journal
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            {currentMonth}{" "}
            <span className="text-muted-foreground font-normal text-2xl">
              {currentYear}
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <CurrentBalance balance={totalBalance} label="Total Balance" />
          <Card className="flex-1 px-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Monthly Expenses
            </p>
            <p className="text-xl font-bold text-destructive">
              {new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP",
              }).format(monthlyExpenses)}
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
      </div>
    </div>
  );
}
