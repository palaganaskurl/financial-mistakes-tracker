import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { AppShell } from "@/components/app-shell";
import { accountsTable } from "@/db/accounts-schema";
import { getDb } from "@/db/d1";
import { financialDramaTable } from "@/db/schema";

import AddFinancialDramaForm from "./-add-financial-drama-form";

const getEditPageData = createServerFn({ method: "GET" })
  .validator((data: unknown) => data as { id: string })
  .handler(async ({ data, context }) => {
    const { useAppSession } = await import("@/lib/session.server");
    const session = await useAppSession();

    if (!session.data.userId) {
      throw redirect({ to: "/" });
    }

    const db = getDb(context);

    const [entry] = await db
      .select()
      .from(financialDramaTable)
      .where(
        and(
          eq(financialDramaTable.id, data.id),
          eq(financialDramaTable.user_id, session.data.userId),
        ),
      );

    if (!entry) throw redirect({ to: "/home" });

    const accounts = await db
      .select({
        id: accountsTable.id,
        name: accountsTable.name,
        type: accountsTable.type,
      })
      .from(accountsTable)
      .where(eq(accountsTable.user_id, session.data.userId));

    return { entry, accounts };
  });

export const Route = createFileRoute("/financial-drama/$id")({
  loader: ({ params }) => getEditPageData({ data: { id: params.id } }),
  component: EditFinancialDramaPage,
});

function EditFinancialDramaPage() {
  const { entry, accounts } = Route.useLoaderData();

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-bold">Edit Financial Drama</h1>
          <AddFinancialDramaForm
            accounts={accounts}
            initialData={{
              id: entry.id,
              type: entry.type as "mistake" | "blessing",
              amount: entry.amount,
              date: entry.date,
              category: entry.category,
              is_planned: entry.is_planned,
              notes: entry.notes,
              blessings_account_id: entry.blessings_account_id,
            }}
          />
        </div>
      </div>
    </AppShell>
  );
}
