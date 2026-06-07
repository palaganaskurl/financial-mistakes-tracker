import { BlessingCategoryToLabelMap } from "@/constants";
import type { financialDramaTable } from "@/db/schema";

type Blessing = typeof financialDramaTable.$inferSelect;

interface BlessingsListProps {
	blessings: Blessing[];
}

export default function BlessingsList({ blessings }: BlessingsListProps) {
	return (
		<div className="flex flex-col gap-3">
			{blessings.map((blessing) => (
				<div
					key={blessing.id}
					className="flex justify-between items-center p-3 border rounded-md border-gray-200 hover:bg-gray-50"
				>
					<span className="text-sm flex-1">
						{BlessingCategoryToLabelMap[blessing.category]}
					</span>
					<span className="text-sm text-right flex-1">
						{new Intl.DateTimeFormat("en-PH", {
							dateStyle: "medium",
						}).format(new Date(blessing.date))}
					</span>
					<span className="text-sm font-medium text-right flex-1">
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
