import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { v4 as uuid } from "uuid";

const DB_NAME = "financial-mistakes-tracker-d1";
const args = process.argv.slice(2);
const isRemote = args.includes("--remote");
const envFlag = isRemote ? "--remote" : "--local";
const isVerbose = args.includes("--verbose");

function escapeSQL(val: unknown): string {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "number") return String(val);
  if (typeof val === "boolean") return val ? "1" : "0";
  return `'${String(val).replace(/'/g, "''")}'`;
}

function ts(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

function sqlDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function insert(table: string, columns: string[], values: Record<string, unknown>[]) {
  if (values.length === 0) return;
  const cols = columns.map((c) => `"${c}"`).join(", ");
  const allValues = values
    .map((v) => `(${columns.map((c) => escapeSQL(v[c])).join(", ")})`)
    .join(",\n  ");
  statements.push(`INSERT INTO "${table}" (${cols}) VALUES\n  ${allValues};`);
}

const statements: string[] = [];

// ---------------------------------------------------------------------------
// USER
// ---------------------------------------------------------------------------
const userId = uuid();
const testUsername = "testuser";
const testPassword = "test1234";
const hashedPassword = createHash("sha256").update(testPassword).digest("hex");
const userCreatedAt = ts(new Date("2026-04-01"));

insert("user", ["id", "username", "password", "name", "created_at", "updated_at", "onboarding_completed"], [
  { id: userId, username: testUsername, password: hashedPassword, name: "Test User", created_at: userCreatedAt, updated_at: userCreatedAt, onboarding_completed: 1 },
]);

// ---------------------------------------------------------------------------
// ACCOUNTS
// ---------------------------------------------------------------------------
const savingsId = uuid();
const checkingId = uuid();
const creditCardId = uuid();

insert("accounts", ["id", "name", "type", "balance", "currency", "date_created", "date_updated", "user_id"], [
  { id: savingsId, name: "Main Savings", type: "savings", balance: 100000, currency: "PHP", date_created: userCreatedAt, date_updated: userCreatedAt, user_id: userId },
  { id: checkingId, name: "Daily Checking", type: "checking", balance: 25000, currency: "PHP", date_created: userCreatedAt, date_updated: userCreatedAt, user_id: userId },
  { id: creditCardId, name: "Platinum Credit Card", type: "credit_card", balance: -35000, currency: "PHP", date_created: userCreatedAt, date_updated: userCreatedAt, user_id: userId },
]);

// ---------------------------------------------------------------------------
// FINANCIAL DRAMA (mistakes & blessings from past 3 months + current month)
// ---------------------------------------------------------------------------
interface DramaInput {
  type: "mistake" | "blessing";
  amount: number;
  date: Date;
  category: string;
  is_planned: boolean;
  notes: string | null;
  account_id: string | null;
}

const dramaEntries: DramaInput[] = [
  // -- April 2026 --
  { type: "mistake", amount: 2450, date: new Date("2026-04-03"), category: "groceries", is_planned: true, notes: null, account_id: checkingId },
  { type: "mistake", amount: 850, date: new Date("2026-04-05"), category: "dining_coffee", is_planned: false, notes: "Lunch with team", account_id: checkingId },
  { type: "mistake", amount: 1200, date: new Date("2026-04-08"), category: "transportation", is_planned: true, notes: "Gas refill", account_id: checkingId },
  { type: "mistake", amount: 499, date: new Date("2026-04-12"), category: "bills_subscriptions", is_planned: true, notes: null, account_id: creditCardId },
  { type: "mistake", amount: 3200, date: new Date("2026-04-19"), category: "groceries", is_planned: true, notes: null, account_id: checkingId },
  { type: "blessing", amount: 50000, date: new Date("2026-04-15"), category: "salary", is_planned: true, notes: null, account_id: savingsId },

  // -- May 2026 --
  { type: "mistake", amount: 2800, date: new Date("2026-05-02"), category: "groceries", is_planned: true, notes: null, account_id: checkingId },
  { type: "mistake", amount: 1500, date: new Date("2026-05-07"), category: "dining_coffee", is_planned: false, notes: "Date night", account_id: checkingId },
  { type: "mistake", amount: 1000, date: new Date("2026-05-10"), category: "transportation", is_planned: true, notes: "Gas refill", account_id: checkingId },
  { type: "mistake", amount: 2000, date: new Date("2026-05-15"), category: "debt_loans", is_planned: true, notes: "Credit card payment", account_id: creditCardId },
  { type: "mistake", amount: 3200, date: new Date("2026-05-20"), category: "groceries", is_planned: true, notes: null, account_id: checkingId },
  { type: "blessing", amount: 50000, date: new Date("2026-05-15"), category: "salary", is_planned: true, notes: null, account_id: savingsId },
  { type: "blessing", amount: 8000, date: new Date("2026-05-22"), category: "side_hustle", is_planned: false, notes: "Website project", account_id: checkingId },

  // -- June 2026 --
  { type: "mistake", amount: 2200, date: new Date("2026-06-02"), category: "groceries", is_planned: true, notes: null, account_id: checkingId },
  { type: "mistake", amount: 900, date: new Date("2026-06-06"), category: "dining_coffee", is_planned: false, notes: "Coffee with friends", account_id: checkingId },
  { type: "mistake", amount: 1100, date: new Date("2026-06-09"), category: "transportation", is_planned: true, notes: "Gas refill", account_id: checkingId },
  { type: "mistake", amount: 3500, date: new Date("2026-06-14"), category: "housing_utilities", is_planned: true, notes: "Electric bill", account_id: checkingId },
  { type: "mistake", amount: 750, date: new Date("2026-06-20"), category: "gifts_donations", is_planned: false, notes: "Birthday gift", account_id: checkingId },
  { type: "blessing", amount: 50000, date: new Date("2026-06-15"), category: "salary", is_planned: true, notes: null, account_id: savingsId },
  { type: "blessing", amount: 3500, date: new Date("2026-06-18"), category: "reimbursement", is_planned: false, notes: "Travel expense reimbursement", account_id: checkingId },
  { type: "blessing", amount: 1000, date: new Date("2026-06-25"), category: "gift", is_planned: false, notes: "Birthday money from mom", account_id: checkingId },

  // -- July 2026 (current month) --
  { type: "mistake", amount: 1800, date: new Date("2026-07-01"), category: "groceries", is_planned: true, notes: null, account_id: checkingId },
  { type: "mistake", amount: 650, date: new Date("2026-07-03"), category: "dining_coffee", is_planned: false, notes: "Team lunch", account_id: checkingId },
  { type: "blessing", amount: 50000, date: new Date("2026-07-15"), category: "salary", is_planned: true, notes: null, account_id: savingsId },
];

const dramaColumns = ["id", "type", "amount", "date", "category", "is_planned", "notes", "date_created", "date_updated", "user_id", "account_id"];
const dramaValues = dramaEntries.map((entry) => ({
  id: uuid(),
  type: entry.type,
  amount: entry.amount,
  date: sqlDate(entry.date),
  category: entry.category,
  is_planned: entry.is_planned,
  notes: entry.notes,
  date_created: ts(entry.date),
  date_updated: null,
  user_id: userId,
  account_id: entry.account_id,
}));
insert("financialDrama", dramaColumns, dramaValues);

// ---------------------------------------------------------------------------
// BUDGETS (current month: July 2026)
// ---------------------------------------------------------------------------
insert("budgets", ["id", "category", "amount_limit", "period", "month", "year", "user_id", "date_created", "date_updated"], [
  { id: uuid(), category: "groceries", amount_limit: 12000, period: "monthly", month: 7, year: 2026, user_id: userId, date_created: ts(new Date("2026-07-01")), date_updated: ts(new Date("2026-07-01")) },
  { id: uuid(), category: "dining_coffee", amount_limit: 5000, period: "monthly", month: 7, year: 2026, user_id: userId, date_created: ts(new Date("2026-07-01")), date_updated: ts(new Date("2026-07-01")) },
  { id: uuid(), category: "transportation", amount_limit: 4000, period: "monthly", month: 7, year: 2026, user_id: userId, date_created: ts(new Date("2026-07-01")), date_updated: ts(new Date("2026-07-01")) },
  { id: uuid(), category: "bills_subscriptions", amount_limit: 10000, period: "monthly", month: 7, year: 2026, user_id: userId, date_created: ts(new Date("2026-07-01")), date_updated: ts(new Date("2026-07-01")) },
]);

// ---------------------------------------------------------------------------
// RECURRING
// ---------------------------------------------------------------------------
insert("recurring", ["id", "name", "type", "amount", "category", "frequency", "start_date", "end_date", "is_active", "user_id", "date_created", "date_updated"], [
  { id: uuid(), name: "Rent", type: "mistake", amount: 15000, category: "housing_utilities", frequency: "monthly", start_date: "2026-04-01", end_date: null, is_active: true, user_id: userId, date_created: userCreatedAt, date_updated: userCreatedAt },
  { id: uuid(), name: "Monthly Salary", type: "blessing", amount: 50000, category: "salary", frequency: "monthly", start_date: "2026-04-01", end_date: null, is_active: true, user_id: userId, date_created: userCreatedAt, date_updated: userCreatedAt },
  { id: uuid(), name: "Netflix", type: "mistake", amount: 499, category: "bills_subscriptions", frequency: "monthly", start_date: "2026-04-01", end_date: null, is_active: true, user_id: userId, date_created: userCreatedAt, date_updated: userCreatedAt },
  { id: uuid(), name: "Insurance", type: "mistake", amount: 2500, category: "healthcare", frequency: "monthly", start_date: "2026-05-01", end_date: null, is_active: true, user_id: userId, date_created: userCreatedAt, date_updated: userCreatedAt },
]);

// ---------------------------------------------------------------------------
// TRANSFERS
// ---------------------------------------------------------------------------
insert("transfers", ["id", "from_account_id", "to_account_id", "amount", "date", "notes", "user_id", "date_created"], [
  { id: uuid(), from_account_id: checkingId, to_account_id: savingsId, amount: 10000, date: "2026-04-16", notes: "Savings transfer", user_id: userId, date_created: ts(new Date("2026-04-16")) },
  { id: uuid(), from_account_id: checkingId, to_account_id: creditCardId, amount: 5000, date: "2026-05-16", notes: "Credit card payment", user_id: userId, date_created: ts(new Date("2026-05-16")) },
]);

// ---------------------------------------------------------------------------
// EXECUTE
// ---------------------------------------------------------------------------
const sql = statements.join("\n\n");

const tmpFile = join(tmpdir(), `seed-${Date.now()}.sql`);
writeFileSync(tmpFile, sql, "utf-8");

console.log(`Seeding ${envFlag} database…`);

try {
  const cmd = `wrangler d1 execute ${DB_NAME} ${envFlag} --file "${tmpFile}"`;
  if (isVerbose) {
    console.log(`\n$ ${cmd}\n`);
    console.log(sql);
    console.log();
  }
  execSync(cmd, { stdio: isVerbose ? "inherit" : "pipe" });
  console.log("Done!");
  console.log(`  Username: ${testUsername}`);
  console.log(`  Password: ${testPassword}`);
  console.log(`  ${dramaValues.length} financial drama entries`);
  console.log(`  4 budgets`);
  console.log(`  4 recurring entries`);
  console.log(`  2 transfers`);
} catch (err) {
  console.error("Seed failed:", err instanceof Error ? err.message : err);
  process.exit(1);
} finally {
  unlinkSync(tmpFile);
}
