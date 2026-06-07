import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { accountsTable } from "@/db/accounts-schema";
import { getDb } from "@/db/d1";
import AddFinancialDramaForm from "./-add-financial-drama-form";

const getPageData = createServerFn({ method: "GET" }).handler(
  async ({ context }) => {
    const db = getDb(context);
    // TODO: filter by session userId once auth is implemented
    const accounts = await db
      .select({
        id: accountsTable.id,
        name: accountsTable.name,
        type: accountsTable.type,
      })
      .from(accountsTable);

    return { accounts, userId: "" };
  },
);

export const Route = createFileRoute("/financial-drama/")({
  loader: () => getPageData(),
  component: AddFinancialDramaPage,
});

function AddFinancialDramaPage() {
  const { accounts, userId } = Route.useLoaderData();

  return (
    <main className="px-4 md:px-8 pb-20 md:pb-0 min-h-[calc(100dvh-72px)]">
      <div className="max-w-2xl mx-auto py-8">
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-bold">Add Financial Drama</h1>
          <AddFinancialDramaForm userId={userId} accounts={accounts} />
        </div>
      </div>
    </main>
  );
}
