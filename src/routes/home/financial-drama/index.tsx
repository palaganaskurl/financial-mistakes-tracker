import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db/d1";
import { financialDramaTable } from "@/db/schema";
import RecentFinancialDramas from "../-recent-financial-dramas";

const dramaFilterSchema = z.enum(["all", "blessings", "mistakes", "last30"]);

const getFinancialDramas = createServerFn({ method: "GET" })
  .validator(
    (data: unknown) =>
      data as {
        startDate?: string;
        endDate?: string;
        filter?: z.infer<typeof dramaFilterSchema>;
      },
  )
  .handler(async ({ data, context }) => {
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

    const conditions = [eq(financialDramaTable.user_id, userId)];

    if (data.startDate) {
      conditions.push(gte(financialDramaTable.date, data.startDate));
    }
    if (data.endDate) {
      conditions.push(lte(financialDramaTable.date, data.endDate));
    }

    if (data.filter === "blessings") {
      conditions.push(eq(financialDramaTable.type, "blessing"));
    }

    if (data.filter === "mistakes") {
      conditions.push(eq(financialDramaTable.type, "mistake"));
    }

    if (data.filter === "last30") {
      conditions.push(
        gte(financialDramaTable.date, sql`date(${todayStr}, '-30 days')`),
      );
      conditions.push(lte(financialDramaTable.date, todayStr));
    }

    const items = await db
      .select()
      .from(financialDramaTable)
      .where(and(...conditions))
      .orderBy(desc(financialDramaTable.date));

    return { items };
  });

export const Route = createFileRoute("/home/financial-drama/")({
  validateSearch: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    filter: dramaFilterSchema.optional(),
  }),
  loaderDeps: ({ search: { startDate, endDate, filter } }) => ({
    startDate,
    endDate,
    filter,
  }),
  loader: ({ deps }) => getFinancialDramas({ data: deps }),
  component: AllFinancialDramasPage,
});

function AllFinancialDramasPage() {
  const { items } = Route.useLoaderData();
  const { filter } = Route.useSearch();
  const activeFilter = filter ?? "all";

  const filters = [
    { label: "All", value: "all" },
    { label: "Blessings", value: "blessings" },
    { label: "Mistakes", value: "mistakes" },
    { label: "Last 30 days", value: "last30" },
  ] as const;

  return (
    <div className="w-full px-4 md:px-6">
      <div className="flex flex-col gap-4 py-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {filters.map((item) => {
            const isActive = activeFilter === item.value;

            return (
              <Link
                key={item.value}
                to="/home/financial-drama"
                search={(prev) => ({
                  ...prev,
                  filter: item.value === "all" ? undefined : item.value,
                })}
                className={`shrink-0 rounded-full px-3 py-1.5 text-sm ring-1 transition-colors ${
                  isActive
                    ? "bg-foreground text-background ring-foreground"
                    : "bg-background text-foreground ring-border hover:bg-muted"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <RecentFinancialDramas items={items} />
      </div>
    </div>
  );
}
