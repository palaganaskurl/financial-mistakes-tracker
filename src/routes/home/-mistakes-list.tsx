import { MistakeCategoryToLabelMap } from "@/constants";
import type { financialDramaTable } from "@/db/schema";

type Mistake = typeof financialDramaTable.$inferSelect;

interface MistakesListProps {
  mistakes: Mistake[];
}

export default function MistakesList({ mistakes }: MistakesListProps) {
  if (mistakes.length === 0) {
    return (
      <div className="rounded-xl border border-border p-4 text-center text-muted-foreground text-sm">
        No mistakes logged yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {mistakes.map((mistake) => (
        <div
          key={mistake.id}
          className="flex justify-between items-center px-4 py-3 rounded-xl bg-card hover:bg-accent/40 transition-colors"
        >
          <span className="text-sm flex-1 font-medium">
            {MistakeCategoryToLabelMap[mistake.category]}
          </span>
          <span className="text-xs text-muted-foreground flex-1 text-center">
            {new Intl.DateTimeFormat("en-PH", {
              dateStyle: "medium",
            }).format(new Date(mistake.date))}
          </span>
          <span className="text-sm font-semibold text-destructive text-right flex-1">
            -
            {new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
            }).format(mistake.amount)}
          </span>
        </div>
      ))}
    </div>
  );
}
