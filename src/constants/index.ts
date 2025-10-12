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
  (category) => category.value
);
export const MistakeCategoryToLabelMap = Object.fromEntries(
  MistakeCategories.map((category) => [category.value, category.label])
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
  (category) => category.value
);
export const BlessingCategoryToLabelMap = Object.fromEntries(
  BlessingCategories.map((category) => [category.value, category.label])
);

export const FinancialDramaTypes = ["mistake", "blessing"] as const;
export const FinancialDramaFormSchema = z
  .object({
    type: z.enum(FinancialDramaTypes, {
      message: "Please select a type.",
    }),
    amount: z.coerce.number().gt(0, {
      message: "Amount must be greater than 0.",
    }),
    date: z.date({
      message: "A date is required.",
    }),
    category: z.string({ message: "Please select a category." }),
    is_planned: z.boolean().default(true).optional(),
    notes: z.coerce.string().optional(),
    user_id: z.string().nonempty({ message: "User ID is required." }),
  })
  .superRefine((data, ctx) => {
    const validCategories: string[] =
      data.type === "mistake"
        ? MistakeCategories.map((c) => c.value)
        : data.type === "blessing"
        ? BlessingCategories.map((c) => c.value)
        : [];

    if (!validCategories.includes(data.category)) {
      ctx.addIssue({
        path: ["category"],
        code: "custom",
        message: `Invalid category for type "${data.type}".`,
      });
    }
  });

export const MAX_PASSWORD_LENGTH = 6;

export const SignUpFormSchema = z
  .object({
    email: z.email({ message: "Invalid email address." }),
    password: z.string().min(MAX_PASSWORD_LENGTH, {
      message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string().min(MAX_PASSWORD_LENGTH, {
      message: "Confirm Password must be at least 6 characters.",
    }),
    // Ensure passwords match
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });

export const SignInFormSchema = z.object({
  email: z.email({ message: "Invalid email address." }),
  password: z.string().min(MAX_PASSWORD_LENGTH, {
    message: "Password must be at least 6 characters.",
  }),
});
