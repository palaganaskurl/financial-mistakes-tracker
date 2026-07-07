import {
  createFileRoute,
  Link,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { ArrowLeft, Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { deleteRecurring } from "@/actions/delete-recurring";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  BlessingCategoryToLabelMap,
  MistakeCategoryToLabelMap,
  RecurringFrequencies,
} from "@/constants";
import { getDb } from "@/db/d1";
import { recurringTable } from "@/db/schema";
import AddRecurringForm from "./-add-recurring-form";

const getRecurringData = createServerFn({ method: "GET" }).handler(
  async ({ context }) => {
    const { useAppSession } = await import("@/lib/session.server");
    const session = await useAppSession();

    if (!session.data.userId) {
      throw redirect({ to: "/" });
    }

    const db = getDb(context);
    const items = await db
      .select()
      .from(recurringTable)
      .where(eq(recurringTable.user_id, session.data.userId))
      .orderBy(recurringTable.frequency, recurringTable.name);

    return { items };
  },
);

export const Route = createFileRoute("/home/recurring/")({
  loader: () => getRecurringData(),
  component: RecurringPage,
});

type RecurringItem = Awaited<
  ReturnType<typeof getRecurringData>
>["items"][number];

const FREQUENCY_ORDER = ["weekly", "monthly", "yearly"] as const;

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
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

function RecurringPage() {
  const { items } = Route.useLoaderData();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<RecurringItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteRecurring({ data: { id } });
      router.invalidate();
    } finally {
      setDeletingId(null);
    }
  }

  function handleEdit(item: RecurringItem) {
    setEditingItem(item);
    setShowAddForm(false);
  }

  function handleFormSuccess() {
    setEditingItem(null);
    setShowAddForm(false);
    router.invalidate();
  }

  const grouped = FREQUENCY_ORDER.reduce(
    (acc, freq) => {
      acc[freq] = items.filter((i) => i.frequency === freq);
      return acc;
    },
    {} as Record<string, RecurringItem[]>,
  );

  if (showAddForm || editingItem) {
    return (
      <div className="w-full px-4 md:px-6 pb-20 md:pb-6 h-[calc(100dvh-72px)] overflow-y-auto">
        <div className="flex flex-col gap-6 py-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setEditingItem(null);
              }}
              className="p-1 hover:opacity-70 transition-opacity"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold">
              {editingItem ? "Edit Recurring" : "Add Recurring"}
            </h1>
          </div>
          <AddRecurringForm
            initialData={
              editingItem
                ? {
                    id: editingItem.id,
                    name: editingItem.name,
                    type: editingItem.type as "mistake" | "blessing",
                    amount: editingItem.amount,
                    category: editingItem.category,
                    frequency: editingItem.frequency as
                      | "weekly"
                      | "monthly"
                      | "yearly",
                    start_date: editingItem.start_date,
                    end_date: editingItem.end_date,
                    is_active: editingItem.is_active,
                  }
                : undefined
            }
            onSuccess={handleFormSuccess}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-6 pb-20 md:pb-6 h-[calc(100dvh-72px)] overflow-y-auto">
      <div className="flex flex-col gap-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/home">
              <button
                type="button"
                className="p-1 hover:opacity-70 transition-opacity"
              >
                <ArrowLeft size={24} />
              </button>
            </Link>
            <h1 className="text-2xl font-bold">Recurring</h1>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => setShowAddForm(true)}
            className="gap-1"
          >
            <Plus size={16} />
            Add
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="text-center text-muted-foreground py-12 text-sm">
            No recurring payments yet.
          </div>
        ) : (
          FREQUENCY_ORDER.map((freq) => {
            const group = grouped[freq];
            if (!group || group.length === 0) return null;
            const label = RecurringFrequencies.find(
              (f) => f.value === freq,
            )?.label;
            return (
              <div key={freq} className="flex flex-col gap-3">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {label}
                </h2>
                {group.map((item) => (
                  <RecurringCard
                    key={item.id}
                    item={item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isDeleting={deletingId === item.id}
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
