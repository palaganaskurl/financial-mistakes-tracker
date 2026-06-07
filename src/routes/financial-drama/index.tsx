import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { accountsTable } from "@/db/accounts-schema";
import { getDb } from "@/db/d1";
import { useAppSession } from "@/lib/session";
import AddFinancialDramaForm from "./-add-financial-drama-form";

const getPageData = createServerFn({ method: "GET" }).handler(
  async ({ context }) => {
    const session = await useAppSession();

    if (!session.data.userId) {
      throw redirect({ to: "/" });
    }

    const db = getDb(context);
    const accounts = await db
      .select({
        id: accountsTable.id,
        name: accountsTable.name,
        type: accountsTable.type,
      })
      .from(accountsTable)
      .where(eq(accountsTable.user_id, session.data.userId));

    return { accounts };
  },
);

export const Route = createFileRoute("/financial-drama/")({
  loader: () => getPageData(),
  component: AddFinancialDramaPage,
});

function AddFinancialDramaPage() {
  const { accounts } = Route.useLoaderData();

  return (
    <main className="px-4 md:px-8 pb-20 md:pb-0 min-h-[calc(100dvh-72px)]">
      <div className="max-w-2xl mx-auto py-8">
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-bold">Add Financial Drama</h1>
          <AddFinancialDramaForm accounts={accounts} />
        </div>
      </div>
    </main>
  );
}
