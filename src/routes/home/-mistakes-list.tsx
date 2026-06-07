import { MistakeCategoryToLabelMap } from "@/constants";
import type { financialDramaTable } from "@/db/schema";

type Mistake = typeof financialDramaTable.$inferSelect;

interface MistakesListProps {
  mistakes: Mistake[];
}

export default function MistakesList({ mistakes }: MistakesListProps) {
  return (
    <div className="flex flex-col gap-3">
      {mistakes.map((mistake) => (
        <div
          key={mistake.id}
          className="flex justify-between items-center p-3 border rounded-md border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <span className="text-sm flex-1">
            {MistakeCategoryToLabelMap[mistake.category]}
          </span>
          <span className="text-sm text-right flex-1">
            {new Intl.DateTimeFormat("en-PH", {
              dateStyle: "medium",
            }).format(new Date(mistake.date))}
          </span>
          <span className="text-sm font-medium text-right flex-1">
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
