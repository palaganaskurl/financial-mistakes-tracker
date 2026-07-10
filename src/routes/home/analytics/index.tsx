import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { and, eq, sql, sum } from "drizzle-orm";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { MistakeCategoryToLabelMap } from "@/constants";
import { getDb } from "@/db/d1";
import { financialDramaTable } from "@/db/schema";

const CATEGORY_CHART_VARS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const getAnalyticsData = createServerFn({ method: "GET" }).handler(
  async ({ context }) => {
    const { useAppSession } = await import("@/lib/session.server");
    const session = await useAppSession();
    if (!session.data.userId) throw redirect({ to: "/" });

    const db = getDb(context);
    const userId = session.data.userId;

    const monthlyTotals = await db
      .select({
        month: sql<string>`strftime('%Y-%m', ${financialDramaTable.date})`,
        type: financialDramaTable.type,
        total: sum(financialDramaTable.amount),
      })
      .from(financialDramaTable)
      .where(
        and(
          eq(financialDramaTable.user_id, userId),
          sql`${financialDramaTable.date} >= date('now', '-6 months')`,
        ),
      )
      .groupBy(
        sql`strftime('%Y-%m', ${financialDramaTable.date})`,
        financialDramaTable.type,
      )
      .orderBy(sql`strftime('%Y-%m', ${financialDramaTable.date})`);

    const categorySpending = await db
      .select({
        category: financialDramaTable.category,
        total: sum(financialDramaTable.amount),
      })
      .from(financialDramaTable)
      .where(
        and(
          eq(financialDramaTable.user_id, userId),
          eq(financialDramaTable.type, "mistake"),
          sql`strftime('%Y-%m', ${financialDramaTable.date}) = strftime('%Y-%m', 'now')`,
        ),
      )
      .groupBy(financialDramaTable.category)
      .orderBy(sql`sum(${financialDramaTable.amount}) desc`);

    return { monthlyTotals, categorySpending };
  },
);

export const Route = createFileRoute("/home/analytics/")({
  loader: () => getAnalyticsData(),
  component: AnalyticsPage,
});

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatShortMonth(ym: string) {
  const [year, month] = ym.split("-");
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleString("en-US", { month: "short", year: "2-digit" });
}

function AnalyticsPage() {
  const { monthlyTotals, categorySpending } = Route.useLoaderData();

  const monthMap: Record<string, { income: number; expense: number }> = {};
  for (const row of monthlyTotals) {
    if (!row.month) continue;
    if (!monthMap[row.month]) monthMap[row.month] = { income: 0, expense: 0 };
    if (row.type === "blessing")
      monthMap[row.month].income += Number(row.total ?? 0);
    if (row.type === "mistake")
      monthMap[row.month].expense += Number(row.total ?? 0);
  }

  const monthlyChartData = Object.entries(monthMap).map(([ym, vals]) => ({
    month: formatShortMonth(ym),
    income: vals.income,
    expense: vals.expense,
  }));

  const categoryChartData = categorySpending.map((c, i) => ({
    name: MistakeCategoryToLabelMap[c.category] ?? c.category,
    key: c.category ?? `cat-${i}`,
    value: Number(c.total ?? 0),
    fill: CATEGORY_CHART_VARS[i % CATEGORY_CHART_VARS.length],
  }));

  const categoryChartConfig = {
    value: { label: "Amount" },
    ...Object.fromEntries(
      categoryChartData.map((c) => [c.key, { label: c.name, color: c.fill }]),
    ),
  } satisfies ChartConfig;

  const totalIncome = monthlyChartData.reduce((s, r) => s + r.income, 0);
  const totalExpense = monthlyChartData.reduce((s, r) => s + r.expense, 0);
  const savingsRate =
    totalIncome > 0
      ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1)
      : null;

  const expenseChartConfig = {
    expense: { label: "Expenses", color: "var(--mistake)" },
  } satisfies ChartConfig;

  const incomeExpenseChartConfig = {
    income: { label: "Income", color: "var(--blessing)" },
    expense: { label: "Expenses", color: "var(--mistake)" },
  } satisfies ChartConfig;

  const savingsRateData = monthlyChartData.map((d) => ({
    month: d.month,
    rate:
      d.income > 0
        ? Number((((d.income - d.expense) / d.income) * 100).toFixed(1))
        : 0,
    positive: d.income > 0 && d.income - d.expense >= 0,
  }));

  const savingsRateChartConfig = {
    rate: { label: "Savings Rate" },
  } satisfies ChartConfig;

  const axisTickProps = { fontSize: 10 };

  return (
    <div className="w-full px-4 md:px-6">
      <div className="flex flex-col gap-6 py-8">
        {savingsRate !== null && (
          <Card className="px-4 py-3 flex-row items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Savings Rate (6 mo avg)
            </span>
            <span
              className={`text-lg font-bold ${Number(savingsRate) >= 0 ? "text-blessing" : "text-destructive"}`}
            >
              {savingsRate}%
            </span>
          </Card>
        )}

        <div className="flex flex-col gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Monthly Expenses (Last 6 Months)
          </h2>
          {monthlyChartData.length === 0 ? (
            <Card className="px-4 py-8 items-center justify-center">
              <p className="text-muted-foreground text-sm text-center w-full">
                No data yet.
              </p>
            </Card>
          ) : (
            <Card className="px-2 py-4">
              <ChartContainer
                config={expenseChartConfig}
                className="h-[200px] w-full"
              >
                <BarChart
                  data={monthlyChartData}
                  margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={axisTickProps}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={axisTickProps}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) =>
                      v >= 1000 ? `₱${(v / 1000).toFixed(0)}k` : `₱${v}`
                    }
                    width={40}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(v) => formatCurrency(Number(v))}
                      />
                    }
                  />
                  <Bar
                    dataKey="expense"
                    fill="var(--color-expense)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Income vs Expenses
          </h2>
          {monthlyChartData.length === 0 ? (
            <Card className="px-4 py-8 items-center justify-center">
              <p className="text-muted-foreground text-sm text-center w-full">
                No data yet.
              </p>
            </Card>
          ) : (
            <Card className="px-2 py-4">
              <ChartContainer
                config={incomeExpenseChartConfig}
                className="h-[200px] w-full"
              >
                <BarChart
                  data={monthlyChartData}
                  margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={axisTickProps}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={axisTickProps}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) =>
                      v >= 1000 ? `₱${(v / 1000).toFixed(0)}k` : `₱${v}`
                    }
                    width={40}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(v) => formatCurrency(Number(v))}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="income"
                    fill="var(--color-income)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="expense"
                    fill="var(--color-expense)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Category Breakdown (This Month)
          </h2>
          {categoryChartData.length === 0 ? (
            <Card className="px-4 py-8 items-center justify-center">
              <p className="text-muted-foreground text-sm text-center w-full">
                No expenses this month.
              </p>
            </Card>
          ) : (
            <Card className="px-2 py-4">
              <ChartContainer
                config={categoryChartConfig}
                className="h-[220px] w-full"
              >
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    nameKey="key"
                    label={false}
                  >
                    {categoryChartData.map((entry) => (
                      <Cell key={`cell-${entry.key}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        nameKey="key"
                        formatter={(v) => formatCurrency(Number(v))}
                      />
                    }
                  />
                  <ChartLegend
                    content={<ChartLegendContent nameKey="key" />}
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                  />
                </PieChart>
              </ChartContainer>
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Savings Rate Trend
          </h2>
          {monthlyChartData.length === 0 ? (
            <Card className="px-4 py-8 items-center justify-center">
              <p className="text-muted-foreground text-sm text-center w-full">
                No data yet.
              </p>
            </Card>
          ) : (
            <Card className="px-2 py-4">
              <ChartContainer
                config={savingsRateChartConfig}
                className="h-[180px] w-full"
              >
                <BarChart
                  data={savingsRateData}
                  margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={axisTickProps}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={axisTickProps}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                    width={36}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(v) => [`${Number(v)}%`]}
                      />
                    }
                  />
                  <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                    {savingsRateData.map((d) => (
                      <Cell
                        key={`cell-${d.month}`}
                        fill={d.positive ? "var(--blessing)" : "var(--mistake)"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
