import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";
import { MistakeCategoryToLabelMap } from "@/constants";
import { getDb } from "@/db/d1";
import { financialDramaTable } from "@/db/schema";

const getMistakes = createServerFn({ method: "GET" })
	.validator(
		(data: unknown) =>
			data as { startDate?: string; endDate?: string },
	)
	.handler(async ({ data, context }) => {
		const db = getDb(context);

		const conditions: ReturnType<typeof eq>[] = [
			eq(financialDramaTable.type, "mistake"),
		];

		if (data.startDate) {
			conditions.push(gte(financialDramaTable.date, data.startDate));
		}
		if (data.endDate) {
			conditions.push(lte(financialDramaTable.date, data.endDate));
		}

		const mistakes = await db
			.select()
			.from(financialDramaTable)
			.where(and(...conditions))
			.orderBy(desc(financialDramaTable.date));

		const totalAmount = mistakes.reduce((sum, m) => sum + m.amount, 0);

		return { mistakes, totalAmount };
	});

export const Route = createFileRoute("/home/mistakes/")({
	validateSearch: z.object({
		startDate: z.string().optional(),
		endDate: z.string().optional(),
	}),
	loaderDeps: ({ search: { startDate, endDate } }) => ({ startDate, endDate }),
	loader: ({ deps }) => getMistakes({ data: deps }),
	component: AllMistakesPage,
});

function AllMistakesPage() {
	const { mistakes, totalAmount } = Route.useLoaderData();
	const { startDate, endDate } = Route.useSearch();
	const hasFilter = !!startDate || !!endDate;

	return (
		<div className="w-full px-4 md:px-6 pb-20 md:pb-6">
			<div className="flex flex-col gap-6 py-6">
				<div className="flex items-center gap-3">
					<Link to="/home">
						<button
							type="button"
							className="p-1 hover:opacity-70 transition-opacity"
						>
							<ArrowLeft size={20} />
						</button>
					</Link>
					<h1 className="text-2xl font-bold">All Mistakes</h1>
				</div>

				{hasFilter && (
					<div className="border rounded-lg p-4 border-gray-200">
						<p className="text-sm font-medium mb-2">Total</p>
						<p className="text-lg font-bold">
							{new Intl.NumberFormat("en-PH", {
								style: "currency",
								currency: "PHP",
							}).format(totalAmount)}
						</p>
					</div>
				)}

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

					{mistakes.length === 0 && (
						<p className="text-sm text-gray-500 text-center py-8">
							No mistakes found.
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
