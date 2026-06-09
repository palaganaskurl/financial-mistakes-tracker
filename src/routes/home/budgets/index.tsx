import {
  createFileRoute,
  Link,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { and, eq, sum } from "drizzle-orm";
import { ArrowLeft, Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { Toaster } from "sonner";
import { deleteBudget } from "@/actions/delete-budget";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MistakeCategoryToLabelMap, MONTHS } from "@/constants";
import { getDb } from "@/db/d1";
import { budgetsTable, financialDramaTable } from "@/db/schema";
import AddBudgetForm from "./-add-budget-form";

const getBudgetsData = createServerFn({ method: "GET" }).handler(
  async ({ context }) => {
    const { useAppSession } = await import("@/lib/session.server");
    const session = await useAppSession();

    if (!session.data.userId) {
      throw redirect({ to: "/" });
    }

    const db = getDb(context);
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const budgets = await db
      .select()
      .from(budgetsTable)
      .where(
        and(
          eq(budgetsTable.user_id, session.data.userId),
          eq(budgetsTable.month, currentMonth),
          eq(budgetsTable.year, currentYear),
        ),
      )
      .orderBy(budgetsTable.category);

    const spendingByCategory = await db
      .select({
        category: financialDramaTable.category,
        total: sum(financialDramaTable.amount),
      })
      .from(financialDramaTable)
      .where(
        and(
          eq(financialDramaTable.user_id, session.data.userId),
          eq(financialDramaTable.type, "mistake"),
        ),
      )
      .groupBy(financialDramaTable.category);

    const spendingMap = Object.fromEntries(
      spendingByCategory.map((s) => [s.category, Number(s.total ?? 0)]),
    );

    return { budgets, spendingMap, currentMonth, currentYear };
  },
);

export const Route = createFileRoute("/home/budgets/")({
  loader: () => getBudgetsData(),
  component: BudgetsPage,
});

type Budget = Awaited<ReturnType<typeof getBudgetsData>>["budgets"][number];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
}

function BudgetCard({
  budget,
  spent,
  onEdit,
  onDelete,
  isDeleting,
}: {
  budget: Budget;
  spent: number;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  const pct = Math.min((spent / budget.amount_limit) * 100, 100);
  const isOver = spent > budget.amount_limit;

  return (
    <Card className="px-4 py-3 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="font-semibold text-sm truncate">
            {MistakeCategoryToLabelMap[budget.category] ?? budget.category}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatCurrency(spent)} / {formatCurrency(budget.amount_limit)}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onEdit(budget)}
            className="p-2 rounded-md hover:bg-muted transition-colors"
            aria-label="Edit"
          >
            <Pencil size={14} />
          </button>
          <DeleteConfirmDialog
            onConfirm={() => onDelete(budget.id)}
            isDeleting={isDeleting}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${isOver ? "bg-destructive" : "bg-primary"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs">
          <span
            className={
              isOver ? "text-destructive font-medium" : "text-muted-foreground"
            }
          >
            {Math.round(pct)}% used
          </span>
          {isOver && (
            <span className="text-destructive font-semibold">
              Over by {formatCurrency(spent - budget.amount_limit)}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

function BudgetsPage() {
  const { budgets, spendingMap, currentMonth, currentYear } =
    Route.useLoaderData();
  const router = useRouter();
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const monthLabel = MONTHS.find((m) => m.value === currentMonth)?.label ?? "";

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteBudget({ data: { id } });
      router.invalidate();
    } finally {
      setDeletingId(null);
    }
  }

  if (showForm || editingBudget) {
    return (
      <div className="w-full px-4 pb-20 h-[calc(100dvh-72px)] overflow-y-auto">
        <div className="flex flex-col gap-6 py-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingBudget(null);
              }}
              className="p-2 rounded-md hover:bg-muted transition-colors -ml-2"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">
              {editingBudget ? "Edit Budget" : "Add Budget"}
            </h1>
          </div>
          <AddBudgetForm
            initialData={editingBudget ?? undefined}
            onSuccess={() => {
              setShowForm(false);
              setEditingBudget(null);
              router.invalidate();
            }}
          />
        </div>
        <Toaster richColors position="top-center" />
      </div>
    );
  }

  return (
    <div className="w-full px-4 pb-20 h-[calc(100dvh-72px)] overflow-y-auto">
      <div className="flex flex-col gap-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              Budgets
            </p>
            <h1 className="text-2xl font-bold">
              {monthLabel}{" "}
              <span className="text-muted-foreground font-normal text-xl">
                {currentYear}
              </span>
            </h1>
          </div>
          <Button
            size="sm"
            onClick={() => setShowForm(true)}
            className="gap-1.5"
          >
            <Plus size={16} />
            Add
          </Button>
        </div>

        {budgets.length === 0 ? (
          <Card className="px-4 py-8 items-center justify-center">
            <p className="text-muted-foreground text-sm text-center w-full">
              No budgets set for this month.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => setShowForm(true)}
            >
              Set your first budget
            </Button>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {budgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                spent={spendingMap[budget.category] ?? 0}
                onEdit={(b) => setEditingBudget(b)}
                onDelete={handleDelete}
                isDeleting={deletingId === budget.id}
              />
            ))}
          </div>
        )}

        <div className="flex justify-center">
          <Link
            to="/home/forecast"
            className="text-xs text-primary hover:underline"
          >
            View Forecast →
          </Link>
        </div>
      </div>
      <Toaster richColors position="top-center" />
    </div>
  );
}
