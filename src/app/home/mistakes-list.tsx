import { MistakeCategoryToLabelMap } from "@/constants";
import { getDb } from "@/db/postgres";
import { financialDramaTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Box } from "grommet";

export default async function MistakesList() {
  const db = getDb();

  const mistakes = await db
    .select()
    .from(financialDramaTable)
    .where(eq(financialDramaTable.type, "mistake"))
    .limit(5);

  return (
    <Box gap="medium">
      {mistakes.map((mistake) => (
        <Box direction="row" justify="between" key={mistake.id.toString()}>
          <Box>{MistakeCategoryToLabelMap[mistake.category]}</Box>
          <Box>
            {new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
            }).format(mistake.amount)}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
