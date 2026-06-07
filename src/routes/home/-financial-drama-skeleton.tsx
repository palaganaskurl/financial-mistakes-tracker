import { Skeleton } from "@/components/ui/skeleton";

export default function FinancialDramaSkeleton() {
	return (
		<div className="flex flex-col gap-3">
			<Skeleton className="h-10 rounded-md" />
			<Skeleton className="h-10 rounded-md" />
			<Skeleton className="h-10 rounded-md" />
			<Skeleton className="h-10 rounded-md" />
			<Skeleton className="h-10 rounded-md" />
		</div>
	);
}
