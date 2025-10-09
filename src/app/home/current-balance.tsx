import { getDb } from "@/db/postgres";
import { sql } from "drizzle-orm";
import { Card, CardBody, CardHeader } from "grommet";

export default async function CurrentBalance() {
  const db = getDb();

  const rows = await db
    .execute(
      sql`SELECT SUM(CASE WHEN type = 'blessing' THEN amount ELSE -amount END) AS balance FROM "financialDrama" WHERE date <= NOW()`
    )
    .then((result) => result.rows as { balance: number | null }[]);
  const currentBalance = rows[0]?.balance ?? 0;

  return (
    <Card>
      <CardHeader pad="medium">Balance</CardHeader>
      <CardBody pad="medium">
        {new Intl.NumberFormat("en-PH", {
          style: "currency",
          currency: "PHP",
        }).format(currentBalance)}
      </CardBody>
    </Card>
  );
}
