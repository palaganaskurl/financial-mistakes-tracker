import { z } from "zod";

export const MistakeCategories = [
  { label: "Groceries", value: "groceries" },
  { label: "Dining & Coffee", value: "dining_coffee" },
  { label: "Transportation", value: "transportation" },
  { label: "Housing & Utilities", value: "housing_utilities" },
  { label: "Bills & Subscriptions", value: "bills_subscriptions" },
  { label: "Debt & Loans", value: "debt_loans" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Savings & Investments", value: "savings_investments" },
  { label: "Gifts & Donations", value: "gifts_donations" },
  { label: "Miscellaneous", value: "miscellaneous" },
];
export const MistakeCategoriesValues = MistakeCategories.map(
  (category) => category.value,
);
export const MistakeCategoryToLabelMap = Object.fromEntries(
  MistakeCategories.map((category) => [category.value, category.label]),
);
export const BlessingCategories = [
  { label: "Salary", value: "salary" },
  { label: "Bonus", value: "bonus" },
  { label: "Side Hustle", value: "side_hustle" },
  { label: "Freelance", value: "freelance" },
  { label: "Gift", value: "gift" },
  { label: "Allowance", value: "allowance" },
  { label: "Investment Return", value: "investment_return" },
  { label: "Rental Income", value: "rental_income" },
  { label: "Reimbursement", value: "reimbursement" },
  { label: "Selling Stuff", value: "selling_stuff" },
  { label: "Refund", value: "refund" },
  { label: "Other", value: "other" },
];
export const BlessingCategoriesValues = BlessingCategories.map(
  (category) => category.value,
);
export const BlessingCategoryToLabelMap = Object.fromEntries(
  BlessingCategories.map((category) => [category.value, category.label]),
);

export const FinancialDramaTypes = ["mistake", "blessing"] as const;

export const RecurringFrequencies = [
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
] as const;
export type RecurringFrequency = (typeof RecurringFrequencies)[number]["value"];

export const RecurringFormSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required." }),
    type: z.enum(FinancialDramaTypes, { message: "Please select a type." }),
    amount: z.coerce
      .number()
      .gt(0, { message: "Amount must be greater than 0." }),
    category: z
      .string({ message: "Please select a category." })
      .array()
      .nonempty({ message: "Please select a category." }),
    frequency: z.enum(["weekly", "monthly", "yearly"], {
      message: "Please select a frequency.",
    }),
    start_date: z.date({ message: "Start date is required." }),
    end_date: z.date().optional(),
    is_active: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    const validCategories: string[] =
      data.type === "mistake"
        ? MistakeCategories.map((c) => c.value)
        : BlessingCategories.map((c) => c.value);

    if (!data.category.every((cat) => validCategories.includes(cat))) {
      ctx.addIssue({
        path: ["category"],
        code: "custom",
        message: `Invalid category for type "${data.type}".`,
      });
    }
  });
export const FinancialDramaFormSchema = z
  .object({
    type: z.enum(FinancialDramaTypes, {
      message: "Please select a type.",
    }),
    amount: z.coerce.number().gt(0, {
      message: "Amount must be greater than 0.",
    }),
    date: z.date({
      message: "Date is required.",
    }),
    category: z
      .string({ message: "Please select a category." })
      .array()
      .nonempty({ message: "Please select a category." }),
    is_planned: z.boolean().default(true).optional(),
    notes: z.coerce.string().optional(),
    blessings_account_id: z.coerce
      .string({
        message: "Please select an account.",
      })
      .array()
      .optional(),
  })
  .superRefine((data, ctx) => {
    const validCategories: string[] =
      data.type === "mistake"
        ? MistakeCategories.map((c) => c.value)
        : data.type === "blessing"
          ? BlessingCategories.map((c) => c.value)
          : [];

    if (!data.category.every((cat) => validCategories.includes(cat))) {
      ctx.addIssue({
        path: ["category"],
        code: "custom",
        message: `Invalid category for type "${data.type}".`,
      });
    }

    // Require blessings_account_id when type is blessing
    if (data.type === "blessing" && !data.blessings_account_id) {
      ctx.addIssue({
        path: ["blessings_account_id"],
        code: "custom",
        message: "Please select an account for blessings.",
      });
    }
  });

export const MONTHS = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
] as const;

export const BudgetFormSchema = z.object({
  category: z.string().min(1, { message: "Category is required." }),
  amount_limit: z.coerce
    .number()
    .gt(0, { message: "Amount must be greater than 0." }),
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2020),
});

export const MAX_PASSWORD_LENGTH = 6;

export const SignUpFormSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters." }),
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    password: z.string().min(MAX_PASSWORD_LENGTH, {
      message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string().min(MAX_PASSWORD_LENGTH, {
      message: "Confirm Password must be at least 6 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });

export const SignInFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." }),
  password: z.string().min(MAX_PASSWORD_LENGTH, {
    message: "Password must be at least 6 characters.",
  }),
});
