import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { AppShell } from "@/components/app-shell";
import { accountsTable } from "@/db/accounts-schema";
import { getDb } from "@/db/d1";

import AddFinancialDramaForm from "./-add-financial-drama-form";

const getPageData = createServerFn({ method: "GET" }).handler(
  async ({ context }) => {
    const { useAppSession } = await import("@/lib/session.server");
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
    <AppShell>
      <div className="max-w-2xl mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col gap-6 pb-12">
          <AddFinancialDramaForm accounts={accounts} />
        </div>
      </div>
    </AppShell>
  );
}
