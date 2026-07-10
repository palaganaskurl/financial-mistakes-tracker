import { Card } from "@/components/ui/card";
import {
  BlessingCategoryToLabelMap,
  MistakeCategoryToLabelMap,
} from "@/constants";
import type { financialDramaTable } from "@/db/schema";

type FinancialDrama = typeof financialDramaTable.$inferSelect;

interface RecentFinancialDramasProps {
  items: FinancialDrama[];
}

export default function RecentFinancialDramas({
  items,
}: RecentFinancialDramasProps) {
  if (items.length === 0) {
    return (
      <Card className="px-4 text-center text-muted-foreground text-sm">
        No financial dramas yet.
      </Card>
    );
  }

  const grouped = items.reduce<Record<string, FinancialDrama[]>>(
    (acc, item) => {
      const monthKey = item.date.slice(0, 7);
      if (!acc[monthKey]) {
        acc[monthKey] = [];
      }
      acc[monthKey].push(item);
      return acc;
    },
    {},
  );

  const orderedMonths = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="flex flex-col gap-5">
      {orderedMonths.map((month) => (
        <div key={month} className="flex flex-col gap-2">
          <h3 className="px-1 text-sm font-semibold text-muted-foreground">
            {new Intl.DateTimeFormat("en-PH", {
              month: "long",
              year: "numeric",
            }).format(new Date(`${month}-01`))}
          </h3>

          <div className="flex flex-col gap-2">
            {grouped[month].map((item) => {
              const isMistake = item.type === "mistake";
              const label = isMistake
                ? MistakeCategoryToLabelMap[item.category]
                : BlessingCategoryToLabelMap[item.category];

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-muted/35 px-3 py-2.5 ring-1 ring-foreground/8"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Intl.DateTimeFormat("en-PH", {
                        month: "short",
                        day: "numeric",
                      }).format(new Date(item.date))}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-semibold whitespace-nowrap ${
                      isMistake ? "text-destructive" : "text-blessing"
                    }`}
                  >
                    {isMistake ? "−" : "+"}
                    {new Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: "PHP",
                    }).format(item.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
