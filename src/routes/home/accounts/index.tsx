import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ArrowLeft } from "lucide-react";
import { accountsTable } from "@/db/accounts-schema";
import { getDb } from "@/db/d1";
import AddAccountForm from "./-add-account-form";

const getAccountsData = createServerFn({ method: "GET" }).handler(
  async ({ context }) => {
    const db = getDb(context);
    // TODO: filter by session userId once auth is implemented
    const accounts = await db.select().from(accountsTable);
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

  return (
    <div className="w-full px-4 md:px-6 pb-20 md:pb-6 h-[calc(100dvh-72px)] overflow-y-auto">
      <div className="flex flex-col gap-6 py-6">
        <div className="flex items-center gap-3">
          <Link to="/home">
            <button
              type="button"
              className="p-1 hover:opacity-70 transition-opacity"
            >
              <ArrowLeft size={24} />
            </button>
          </Link>
          <h1 className="text-2xl font-bold">Accounts</h1>
        </div>

        <div className="border rounded-lg p-4 border-gray-200">
          <p className="text-sm font-medium mb-2">Total Balance</p>
          <p className="text-2xl font-bold">
            {new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
            }).format(totalBalance)}
          </p>
        </div>

        {accounts.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold">Your Accounts</p>
            {accounts.map((account) => (
              <div
                key={account.id}
                className="border rounded-lg p-4 border-gray-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col">
                    <p className="font-semibold">{account.name}</p>
                    <p className="text-sm text-gray-600 capitalize">
                      {account.type.replace("_", " ")}
                    </p>
                  </div>
                  <p className="font-bold">
                    {new Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: account.currency,
                    }).format(account.balance)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border rounded-lg p-4 border-gray-200">
          <p className="text-sm font-semibold mb-4">Add New Account</p>
          <AddAccountForm />
        </div>
      </div>
    </div>
  );
}
