import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { deleteAccount } from "@/actions/delete-account";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { Card } from "@/components/ui/card";
import { accountsTable } from "@/db/accounts-schema";
import { getDb } from "@/db/d1";
import AddAccountForm from "./-add-account-form";
import AddTransferForm from "./-add-transfer-form";
import EditAccountForm from "./-edit-account-form";

const getAccountsData = createServerFn({ method: "GET" }).handler(
  async ({ context }) => {
    const { useAppSession } = await import("@/lib/session.server");
    const session = await useAppSession();

    if (!session.data.userId) {
      throw redirect({ to: "/" });
    }

    const db = getDb(context);
    const accounts = await db
      .select()
      .from(accountsTable)
      .where(eq(accountsTable.user_id, session.data.userId));
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    return { accounts, totalBalance };
  },
);

export const Route = createFileRoute("/home/accounts/")({
  loader: () => getAccountsData(),
  component: AccountsPage,
});

function AccountsPage() {
  const { accounts, totalBalance } = Route.useLoaderData();
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteAccount({ data: { id } });
      router.invalidate();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="w-full px-4 md:px-6">
      <div className="flex flex-col gap-6 py-6">
        <h1 className="text-2xl font-bold">Accounts</h1>

        <Card className="px-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Total Balance
          </p>
          <p className="text-2xl font-bold text-primary">
            {new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
            }).format(totalBalance)}
          </p>
        </Card>

        {accounts.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Your Accounts
            </p>
            {accounts.map((account) => (
              <Card key={account.id} className="px-4">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <p className="font-semibold">{account.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {account.type.replace("_", " ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-primary">
                      {new Intl.NumberFormat("en-PH", {
                        style: "currency",
                        currency: account.currency,
                      }).format(account.balance)}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingId(
                          editingId === account.id ? null : account.id,
                        )
                      }
                      className="p-1.5 hover:opacity-70 transition-opacity text-muted-foreground"
                    >
                      <Pencil size={15} />
                    </button>
                    <DeleteConfirmDialog
                      onConfirm={() => handleDelete(account.id)}
                      disabled={deletingId === account.id}
                    />
                  </div>
                </div>

                {editingId === account.id && (
                  <EditAccountForm
                    account={account}
                    onCancel={() => setEditingId(null)}
                  />
                )}
              </Card>
            ))}
          </div>
        )}

        {accounts.length >= 2 && (
          <Card className="px-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Transfer Between Accounts
            </p>
            <AddTransferForm accounts={accounts} />
          </Card>
        )}

        <Card className="px-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            Add New Account
          </p>
          <AddAccountForm />
        </Card>
      </div>
    </div>
  );
}
