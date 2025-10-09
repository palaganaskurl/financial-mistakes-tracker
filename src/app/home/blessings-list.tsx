import { BlessingCategoryToLabelMap } from "@/constants";
import { getDb } from "@/db/postgres";
import { financialDramaTable } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { Box, Grid } from "grommet";
import React from "react";

export default async function BlessingsList() {
  const db = getDb();
  const blessings = await db
    .select()
    .from(financialDramaTable)
    .where(eq(financialDramaTable.type, "blessing"))
    .orderBy(desc(financialDramaTable.date))
    .limit(5);

  return (
    <Grid
      columns={{
        count: 3,
        size: "auto",
      }}
      gap="small"
    >
      {blessings.map((blessing) => (
        <React.Fragment key={blessing.id.toString()}>
          <Box>{BlessingCategoryToLabelMap[blessing.category]}</Box>
          <Box align="end">
            {new Intl.DateTimeFormat("en-PH", {
              dateStyle: "medium",
            }).format(blessing.date)}
          </Box>
          <Box align="end">
            {new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
            }).format(blessing.amount)}
          </Box>
        </React.Fragment>
      ))}
    </Grid>
  );
}
