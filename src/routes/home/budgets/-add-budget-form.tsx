import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { MoneyInput } from "#/components/money-input";
import { addBudget } from "@/actions/add-budget";
import { updateBudget } from "@/actions/update-budget";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BudgetFormSchema, MistakeCategories, MONTHS } from "@/constants";

type BudgetFormValues = z.output<typeof BudgetFormSchema>;

interface InitialData {
  id: string;
  category: string;
  amount_limit: number;
  month: number;
  year: number;
}

export default function AddBudgetForm({
  initialData,
  onSuccess,
}: {
  initialData?: InitialData;
  onSuccess?: () => void;
}) {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const now = new Date();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(BudgetFormSchema),
    defaultValues: initialData
      ? {
          category: initialData.category,
          amount_limit: initialData.amount_limit,
          month: initialData.month,
          year: initialData.year,
        }
      : {
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        },
  });

  async function onSubmit(values: BudgetFormValues) {
    setPending(true);
    try {
      if (initialData) {
        await updateBudget({
          data: { id: initialData.id, ...values },
        });
        toast.success("Budget updated.");
      } else {
        await addBudget({ data: values });
        toast.success("Budget added.");
      }
      onSuccess?.();
      navigate({ to: "/home/budgets" });
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  const currentYear = now.getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label>Category</Label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select value={field.value ?? ""} onValueChange={field.onChange}>
              <SelectTrigger type="button" className="w-full">
                <SelectValue placeholder="Select category">
                  {(value) =>
                    MistakeCategories.find((c) => c.value === value)?.label ??
                    "Select category"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                {MistakeCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.category && (
          <p className="text-xs text-destructive">{errors.category.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Amount Limit (PHP)</Label>
        <Controller
          name="amount_limit"
          control={control}
          render={({ field }) => (
            <MoneyInput
              value={Number(field.value)}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
            />
          )}
        />
        {errors.amount_limit && (
          <p className="text-xs text-destructive">
            {errors.amount_limit.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Label>Month</Label>
          <Controller
            name="month"
            control={control}
            render={({ field }) => (
              <Select
                value={String(field.value)}
                onValueChange={(val) => field.onChange(Number(val))}
              >
                <SelectTrigger type="button" className="w-full">
                  <SelectValue placeholder="Month">
                    {(value) =>
                      MONTHS.find((m) => String(m.value) === value)?.label ??
                      "Month"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  {MONTHS.map((m) => (
                    <SelectItem key={m.value} value={String(m.value)}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Year</Label>
          <Controller
            name="year"
            control={control}
            render={({ field }) => (
              <Select
                value={String(field.value)}
                onValueChange={(val) => field.onChange(Number(val))}
              >
                <SelectTrigger type="button" className="w-full">
                  <SelectValue placeholder="Year">
                    {(value) => value ?? "Year"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  {years.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : initialData ? "Update Budget" : "Add Budget"}
      </Button>
    </form>
  );
}
