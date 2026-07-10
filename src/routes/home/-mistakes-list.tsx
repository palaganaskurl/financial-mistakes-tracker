import { Card } from "@/components/ui/card";
import { MistakeCategoryToLabelMap } from "@/constants";
import type { financialDramaTable } from "@/db/schema";

type Mistake = typeof financialDramaTable.$inferSelect;

interface MistakesListProps {
  mistakes: Mistake[];
}

export default function MistakesList({ mistakes }: MistakesListProps) {
  if (mistakes.length === 0) {
    return (
      <Card className="px-4 text-center text-muted-foreground text-sm">
        No mistakes logged yet.
      </Card>
    );
  }

  const grouped = mistakes.reduce<Record<string, Mistake[]>>((acc, mistake) => {
    if (!acc[mistake.date]) {
      acc[mistake.date] = [];
    }
    acc[mistake.date].push(mistake);
    return acc;
  }, {});

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
            {items.map((mistake) => (
              <div
                key={mistake.id}
                className="flex items-center gap-2 p-3 ring-1 ring-foreground/10 rounded-xl"
              >
                <span className="text-sm flex-1 font-medium min-w-0">
                  {MistakeCategoryToLabelMap[mistake.category]}
                </span>
                <span className="text-sm font-semibold text-destructive whitespace-nowrap">
                  -
                  {new Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  }).format(mistake.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
