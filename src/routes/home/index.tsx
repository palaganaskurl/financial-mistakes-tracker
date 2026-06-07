import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { desc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db/d1";
import { financialDramaTable } from "@/db/schema";
import BlessingsList from "./-blessings-list";
import CurrentBalance from "./-current-balance";
import FinancialDramaSkeleton from "./-financial-drama-skeleton";
import MistakesList from "./-mistakes-list";

const STARTING_BALANCE = {
  amount: 100000,
  currency: "PHP",
};

const getHomeData = createServerFn({ method: "GET" }).handler(
  async ({ context }) => {
    const db = getDb(context);

    const rows = (await db.run(
      sql`SELECT SUM(CASE WHEN type = 'blessing' THEN amount ELSE -amount END) AS balance FROM "financialDrama" WHERE date(date) = date('now')`,
    )) as { results?: Array<{ balance: number }> };
    const balance = (rows.results?.[0]?.balance as number) ?? 0;

    const mistakes = await db
      .select()
      .from(financialDramaTable)
      .where(eq(financialDramaTable.type, "mistake"))
      .orderBy(desc(financialDramaTable.date))
      .limit(5);

    const blessings = await db
      .select()
      .from(financialDramaTable)
      .where(eq(financialDramaTable.type, "blessing"))
      .orderBy(desc(financialDramaTable.date))
      .limit(5);

    return { balance, mistakes, blessings };
  },
);

export const Route = createFileRoute("/home/")({
  loader: () => getHomeData(),
  pendingComponent: FinancialDramaSkeleton,
  component: HomePage,
});

function HomePage() {
  const { balance, mistakes, blessings } = Route.useLoaderData();

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
          <CurrentBalance balance={balance} />
          <div className="flex-1 rounded-xl border border-border p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Forecasted
            </p>
            <p className="text-xl font-bold text-foreground">
              {new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: STARTING_BALANCE.currency,
              }).format(STARTING_BALANCE.amount)}
            </p>
          </div>
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
