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
import { deleteRecurring } from "@/actions/delete-recurring";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  BlessingCategoryToLabelMap,
  MistakeCategoryToLabelMap,
  MONTHS,
  RecurringFrequencies,
} from "@/constants";
import { getDb } from "@/db/d1";
import { budgetsTable, financialDramaTable, recurringTable } from "@/db/schema";
import AddBudgetForm from "./-add-budget-form";
import AddRecurringForm from "./-add-recurring-form";

const getPlansData = createServerFn({ method: "GET" }).handler(
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

    const recurringItems = await db
      .select()
      .from(recurringTable)
      .where(eq(recurringTable.user_id, session.data.userId))
      .orderBy(recurringTable.frequency, recurringTable.name);

    return { budgets, spendingMap, currentMonth, currentYear, recurringItems };
  },
);

export const Route = createFileRoute("/home/budgets/")({
  loader: () => getPlansData(),
  component: PlansPage,
});

type Budget = Awaited<
  ReturnType<typeof getPlansData>
>["budgets"][number];
type RecurringItem = Awaited<
  ReturnType<typeof getPlansData>
>["recurringItems"][number];

const FREQUENCY_ORDER = ["weekly", "monthly", "yearly"] as const;

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
            disabled={isDeleting}
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

function RecurringCard({
  item,
  onEdit,
  onDelete,
  isDeleting,
}: {
  item: RecurringItem;
  onEdit: (item: RecurringItem) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  const categoryLabel =
    item.type === "mistake"
      ? MistakeCategoryToLabelMap[item.category]
      : BlessingCategoryToLabelMap[item.category];

  return (
    <Card className="px-4 py-3 flex-row items-center justify-between gap-3">
      <div className="flex flex-col gap-0.5 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm truncate">{item.name}</span>
          {!item.is_active && (
            <span className="text-xs text-muted-foreground bg-muted rounded px-1.5 py-0.5 shrink-0">
              Inactive
            </span>
          )}
        </div>
        <span className="text-xs text-muted-foreground">{categoryLabel}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`text-sm font-bold ${item.type === "mistake" ? "text-destructive" : "text-blessing"}`}
        >
          {item.type === "mistake" ? "-" : "+"}
          {formatCurrency(item.amount)}
        </span>
        <button
          type="button"
          onClick={() => onEdit(item)}
          className="p-1.5 hover:opacity-70 transition-opacity text-muted-foreground"
          aria-label="Edit"
        >
          <Pencil size={14} />
        </button>
        <DeleteConfirmDialog
          onConfirm={() => onDelete(item.id)}
          disabled={isDeleting}
        />
      </div>
    </Card>
  );
}

function PlansPage() {
  const { budgets, spendingMap, currentMonth, currentYear, recurringItems } =
    Route.useLoaderData();
  const router = useRouter();

  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [deletingBudgetId, setDeletingBudgetId] = useState<string | null>(null);

  const [editingRecurring, setEditingRecurring] =
    useState<RecurringItem | null>(null);
  const [showRecurringForm, setShowRecurringForm] = useState(false);
  const [deletingRecurringId, setDeletingRecurringId] = useState<
    string | null
  >(null);

  const monthLabel =
    MONTHS.find((m) => m.value === currentMonth)?.label ?? "";

  const groupedRecurring = FREQUENCY_ORDER.reduce(
    (acc, freq) => {
      acc[freq] = recurringItems.filter((i) => i.frequency === freq);
      return acc;
    },
    {} as Record<string, RecurringItem[]>,
  );

  async function handleDeleteBudget(id: string) {
    setDeletingBudgetId(id);
    try {
      await deleteBudget({ data: { id } });
      router.invalidate();
    } finally {
      setDeletingBudgetId(null);
    }
  }

  async function handleDeleteRecurring(id: string) {
    setDeletingRecurringId(id);
    try {
      await deleteRecurring({ data: { id } });
      router.invalidate();
    } finally {
      setDeletingRecurringId(null);
    }
  }

  if (showBudgetForm || editingBudget) {
    return (
      <div className="w-full px-4 pb-20 h-[calc(100dvh-72px)] overflow-y-auto">
        <div className="flex flex-col gap-6 py-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setShowBudgetForm(false);
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
              setShowBudgetForm(false);
              setEditingBudget(null);
              router.invalidate();
            }}
          />
        </div>
        <Toaster richColors position="top-center" />
      </div>
    );
  }

  if (showRecurringForm || editingRecurring) {
    return (
      <div className="w-full px-4 pb-20 h-[calc(100dvh-72px)] overflow-y-auto">
        <div className="flex flex-col gap-6 py-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setShowRecurringForm(false);
                setEditingRecurring(null);
              }}
              className="p-2 rounded-md hover:bg-muted transition-colors -ml-2"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">
              {editingRecurring ? "Edit Recurring" : "Add Recurring"}
            </h1>
          </div>
          <AddRecurringForm
            initialData={
              editingRecurring
                ? {
                    id: editingRecurring.id,
                    name: editingRecurring.name,
                    type: editingRecurring.type as "mistake" | "blessing",
                    amount: editingRecurring.amount,
                    category: editingRecurring.category,
                    frequency: editingRecurring.frequency as
                      | "weekly"
                      | "monthly"
                      | "yearly",
                    start_date: editingRecurring.start_date,
                    end_date: editingRecurring.end_date,
                    is_active: editingRecurring.is_active,
                  }
                : undefined
            }
            onSuccess={() => {
              setShowRecurringForm(false);
              setEditingRecurring(null);
              router.invalidate();
            }}
          />
        </div>
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
            onClick={() => setShowBudgetForm(true)}
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
              onClick={() => setShowBudgetForm(true)}
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
                onDelete={handleDeleteBudget}
                isDeleting={deletingBudgetId === budget.id}
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

        <hr className="border-t border-border my-1" />

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Recurring</h2>
          <Button
            size="sm"
            onClick={() => setShowRecurringForm(true)}
            className="gap-1"
          >
            <Plus size={16} />
            Add
          </Button>
        </div>

        {recurringItems.length === 0 ? (
          <div className="text-center text-muted-foreground py-8 text-sm">
            No recurring payments yet.
          </div>
        ) : (
          FREQUENCY_ORDER.map((freq) => {
            const group = groupedRecurring[freq];
            if (!group || group.length === 0) return null;
            const label = RecurringFrequencies.find(
              (f) => f.value === freq,
            )?.label;
            return (
              <div key={freq} className="flex flex-col gap-3">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {label}
                </h3>
                {group.map((item) => (
                  <RecurringCard
                    key={item.id}
                    item={item}
                    onEdit={(i) => setEditingRecurring(i)}
                    onDelete={handleDeleteRecurring}
                    isDeleting={deletingRecurringId === item.id}
                  />
                ))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
