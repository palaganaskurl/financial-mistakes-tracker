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

  return (
    <div className="flex flex-col gap-2">
      {blessings.map((blessing) => (
        <div
          key={blessing.id}
          className="flex justify-between items-center px-4 py-3 bg-card ring-1 ring-foreground/10 hover:bg-accent/40 transition-colors"
        >
          <span className="text-sm flex-1 font-medium">
            {BlessingCategoryToLabelMap[blessing.category]}
          </span>
          <span className="text-xs text-muted-foreground flex-1 text-center">
            {new Intl.DateTimeFormat("en-PH", {
              dateStyle: "medium",
            }).format(new Date(blessing.date))}
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
  );
}
