import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { deleteFinancialDrama } from "@/actions/delete-financial-drama";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { Card } from "@/components/ui/card";
import { BlessingCategoryToLabelMap } from "@/constants";
import { getDb } from "@/db/d1";
import { financialDramaTable } from "@/db/schema";

const getBlessings = createServerFn({ method: "GET" })
  .validator(
    (data: unknown) => data as { startDate?: string; endDate?: string },
  )
  .handler(async ({ data, context }) => {
    const db = getDb(context);

    const conditions: ReturnType<typeof eq>[] = [
      eq(financialDramaTable.type, "blessing"),
    ];

    if (data.startDate) {
      conditions.push(gte(financialDramaTable.date, data.startDate));
    }
    if (data.endDate) {
      conditions.push(lte(financialDramaTable.date, data.endDate));
    }

    const blessings = await db
      .select()
      .from(financialDramaTable)
      .where(and(...conditions))
      .orderBy(desc(financialDramaTable.date));

    const totalAmount = blessings.reduce((sum, b) => sum + b.amount, 0);

    return { blessings, totalAmount };
  });

export const Route = createFileRoute("/home/blessings/")({
  validateSearch: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
  loaderDeps: ({ search: { startDate, endDate } }) => ({ startDate, endDate }),
  loader: ({ deps }) => getBlessings({ data: deps }),
  component: AllBlessingsPage,
});

function AllBlessingsPage() {
  const { blessings, totalAmount } = Route.useLoaderData();
  const { startDate, endDate } = Route.useSearch();
  const hasFilter = !!startDate || !!endDate;
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteFinancialDrama({ data: { id } });
      router.invalidate();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="w-full px-4 md:px-6">
      <div className="flex flex-col gap-4 py-6">
        <h1 className="text-2xl font-bold">All Blessings</h1>

        {hasFilter && (
          <Card className="px-4">
            <p className="text-sm font-medium mb-2">Total</p>
            <p className="text-lg font-bold">
              {new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP",
              }).format(totalAmount)}
            </p>
          </Card>
        )}

        <div className="flex flex-col gap-6">
          {(() => {
            const grouped = blessings.reduce<Record<string, typeof blessings>>(
              (acc, blessing) => {
                if (!acc[blessing.date]) {
                  acc[blessing.date] = [];
                }
                acc[blessing.date].push(blessing);
                return acc;
              },
              {},
            );

            return Object.entries(grouped).map(([date, items]) => (
              <div key={date}>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                  {new Intl.DateTimeFormat("en-PH", {
                    dateStyle: "full",
                  }).format(new Date(date))}
                </h3>
                <div className="flex flex-col gap-3">
                  {items.map((blessing) => (
                    <div
                      key={blessing.id}
                      className="flex items-center gap-2 p-3 ring-1 ring-foreground/10"
                    >
                      <span className="text-sm flex-1 font-medium min-w-0">
                        {BlessingCategoryToLabelMap[blessing.category]}
                      </span>
                      <span className="text-sm font-semibold text-blessing whitespace-nowrap">
                        +
                        {new Intl.NumberFormat("en-PH", {
                          style: "currency",
                          currency: "PHP",
                        }).format(blessing.amount)}
                      </span>
                      <Link
                        to="/financial-drama/$id"
                        params={{ id: blessing.id }}
                      >
                        <button
                          type="button"
                          className="p-1.5 hover:opacity-70 transition-opacity text-muted-foreground"
                        >
                          <Pencil size={15} />
                        </button>
                      </Link>
                      <DeleteConfirmDialog
                        onConfirm={() => handleDelete(blessing.id)}
                        disabled={deletingId === blessing.id}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ));
          })()}

          {blessings.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-8">
              No blessings found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
