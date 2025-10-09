import { MistakeCategoryToLabelMap } from "@/constants";
import { getDb } from "@/db/postgres";
import { financialDramaTable } from "@/db/schema";

export default async function MistakesList() {
  const db = getDb();

  const mistakes = await db.select().from(financialDramaTable).limit(5);

  return <>TODO</>;

  return (
    <div className="flex flex-col gap-4">
      {mistakes.map((mistake) => (
        <div key={mistake.id} className="flex justify-between gap-4">
          <div className="flex gap-4">
            <div>{MistakeCategoryToLabelMap[mistake.category]}</div>
          </div>
          <div>
            {new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
            }).format(mistake.amount)}
          </div>
        </div>
      ))}
    </div>
  );
}
