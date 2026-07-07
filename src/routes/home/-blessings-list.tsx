import { Card } from "@/components/ui/card";
import { BlessingCategoryToLabelMap } from "@/constants";
import type { financialDramaTable } from "@/db/schema";

type Blessing = typeof financialDramaTable.$inferSelect;

interface BlessingsListProps {
  blessings: Blessing[];
}

export default function BlessingsList({ blessings }: BlessingsListProps) {
  if (blessings.length === 0) {
    return (
      <Card className="px-4 text-center text-muted-foreground text-sm">
        No blessings logged yet.
      </Card>
    );
  }

  const grouped = blessings.reduce<Record<string, Blessing[]>>(
    (acc, blessing) => {
      if (!acc[blessing.date]) {
        acc[blessing.date] = [];
      }
      acc[blessing.date].push(blessing);
      return acc;
    },
    {},
  );

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(grouped).map(([date, items]) => (
        <div key={date}>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-1">
            {new Intl.DateTimeFormat("en-PH", {
              dateStyle: "full",
            }).format(new Date(date))}
          </h3>
          <div className="flex flex-col gap-2">
            {items.map((blessing) => (
              <div
                key={blessing.id}
                className="flex justify-between items-center px-4 py-3 bg-card ring-1 ring-foreground/10 hover:bg-accent/40 transition-colors"
              >
                <span className="text-sm flex-1 font-medium">
                  {BlessingCategoryToLabelMap[blessing.category]}
                </span>
                <span className="text-sm font-semibold text-blessing text-right flex-1">
                  +
                  {new Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  }).format(blessing.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
