import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { and, eq, sql, sum } from "drizzle-orm";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { MistakeCategoryToLabelMap } from "@/constants";
import { getDb } from "@/db/d1";
import { financialDramaTable } from "@/db/schema";

const CATEGORY_COLORS = [
  "hsl(var(--chart-4))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-1))",
  "hsl(var(--chart-5))",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#a3e635",
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
    savings: vals.income - vals.expense,
  }));

  const categoryChartData = categorySpending.map((c) => ({
    name: MistakeCategoryToLabelMap[c.category] ?? c.category,
    value: Number(c.total ?? 0),
  }));

  const totalIncome = monthlyChartData.reduce((s, r) => s + r.income, 0);
  const totalExpense = monthlyChartData.reduce((s, r) => s + r.expense, 0);
  const savingsRate =
    totalIncome > 0
      ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1)
      : null;

  const tooltipStyle = {
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: 8,
    color: "hsl(var(--foreground))",
    fontSize: 12,
  };

  return (
    <div className="w-full px-4 md:px-6">
      <div className="flex flex-col gap-6 py-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            Analytics
          </p>
          <h1 className="text-2xl font-bold">Overview</h1>
        </div>

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
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={monthlyChartData}
                  margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{
                      fontSize: 10,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{
                      fontSize: 10,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) =>
                      v >= 1000 ? `₱${(v / 1000).toFixed(0)}k` : `₱${v}`
                    }
                    width={40}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v: number) => formatCurrency(v)}
                  />
                  <Bar
                    dataKey="expense"
                    name="Expenses"
                    fill="hsl(var(--mistake))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
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
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={monthlyChartData}
                  margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{
                      fontSize: 10,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{
                      fontSize: 10,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) =>
                      v >= 1000 ? `₱${(v / 1000).toFixed(0)}k` : `₱${v}`
                    }
                    width={40}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v: number) => formatCurrency(v)}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 11 }}
                    iconType="circle"
                    iconSize={8}
                  />
                  <Bar
                    dataKey="income"
                    name="Income"
                    fill="hsl(var(--blessing))"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="expense"
                    name="Expenses"
                    fill="hsl(var(--mistake))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
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
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={false}
                  >
                    {categoryChartData.map((entry) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={
                          CATEGORY_COLORS[
                            categoryChartData.indexOf(entry) %
                              CATEGORY_COLORS.length
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v: number) => formatCurrency(v)}
                  />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    wrapperStyle={{ fontSize: 10, maxWidth: 120 }}
                    iconType="circle"
                    iconSize={8}
                  />
                </PieChart>
              </ResponsiveContainer>
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
              <ResponsiveContainer width="100%" height={180}>
                <BarChart
                  data={monthlyChartData.map((d) => ({
                    month: d.month,
                    rate:
                      d.income > 0
                        ? Number(
                            (((d.income - d.expense) / d.income) * 100).toFixed(
                              1,
                            ),
                          )
                        : 0,
                  }))}
                  margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{
                      fontSize: 10,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{
                      fontSize: 10,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                    width={36}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v: number) => [`${v}%`, "Savings Rate"]}
                  />
                  <Bar dataKey="rate" name="Savings Rate" radius={[4, 4, 0, 0]}>
                    {monthlyChartData.map((d) => (
                      <Cell
                        key={`cell-${d.month}`}
                        fill={
                          d.income > 0 && d.income - d.expense >= 0
                            ? "hsl(var(--blessing))"
                            : "hsl(var(--mistake))"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
