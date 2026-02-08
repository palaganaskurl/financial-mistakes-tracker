"use server";

import { getDb } from "@/db/d1";
import { accountsTable } from "@/db/accounts-schema";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function addAccount(formData: FormData) {
  const session = await getSession();

  if (!session.isLoggedIn) {
    redirect("/sign-up");
  }

  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const balance = parseInt(formData.get("balance") as string, 10);

  if (!name || !type || isNaN(balance)) {
    throw new Error("Invalid account data");
  }

  const db = await getDb();

  try {
    await db.insert(accountsTable).values({
      name,
      type,
      balance,
      currency: "PHP",
      user_id: session.userId,
    });
  } catch (error) {
    console.error("Error inserting account:", error);
    throw error;
  }

  redirect("/home/accounts");
}
