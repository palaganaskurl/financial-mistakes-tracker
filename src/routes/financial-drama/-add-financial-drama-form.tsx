import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import type { z } from "zod";
import { addMistake } from "@/actions/add-mistake";
import { updateFinancialDrama } from "@/actions/update-financial-drama";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MoneyInput } from "@/components/ui/money-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  BlessingCategories,
  FinancialDramaFormSchema,
  MistakeCategories,
} from "@/constants";
import { AccountsTypesMap } from "@/constants/accounts";
import type { accountsTable } from "@/db/accounts-schema";

type Accounts = Array<
  Pick<typeof accountsTable.$inferSelect, "id" | "name" | "type">
>;

type FinancialDramaFormInput = z.input<typeof FinancialDramaFormSchema>;
type FinancialDramaFormValues = z.output<typeof FinancialDramaFormSchema>;

interface InitialData {
  id: string;
  type: "mistake" | "blessing";
  amount: number;
  date: string;
  category: string;
  is_planned: boolean;
  notes?: string | null;
  blessings_account_id?: string | null;
}

export default function AddFinancialDramaForm({
  accounts,
  initialData,
}: {
  accounts: Accounts;
  initialData?: InitialData;
}) {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isEditMode = !!initialData;

  const { register, handleSubmit, watch, formState, control } = useForm<
    FinancialDramaFormInput,
    unknown,
    FinancialDramaFormValues
  >({
    resolver: zodResolver(FinancialDramaFormSchema),
    defaultValues: initialData
      ? {
          type: initialData.type,
          amount: initialData.amount,
          date: new Date(initialData.date),
          is_planned: initialData.is_planned,
          notes: initialData.notes ?? "",
          category: [initialData.category],
          blessings_account_id: initialData.blessings_account_id
            ? [initialData.blessings_account_id]
            : undefined,
        }
      : {
          type: "mistake",
          amount: 0,
          date: new Date(),
          is_planned: true,
          notes: "",
          category: [],
        },
  });

  const currentType = watch("type");
  const categories =
    currentType === "mistake" ? MistakeCategories : BlessingCategories;

  useEffect(() => {
    setMounted(true);
  }, []);

  async function onSubmit(values: FinancialDramaFormValues) {
    console.log("Submitting form with values:", values);
    setPending(true);
    try {
      const payload = {
        type: values.type,
        amount: values.amount,
        date:
          values.date instanceof Date
            ? format(values.date, "yyyy-MM-dd")
            : values.date,
        category: values.category[0],
        is_planned: values.is_planned ?? true,
        notes: values.notes,
        blessings_account_id: values.blessings_account_id?.[0],
      };

      if (isEditMode && initialData) {
        await updateFinancialDrama({
          data: { id: initialData.id, ...payload },
        });
        toast.success("Successfully updated!");
      } else {
        await addMistake({ data: payload });
        toast.success("Successfully added financial drama!");
      }
      setTimeout(() => navigate({ to: "/home" }), 1000);
    } catch {
      toast.error(
        isEditMode ? "Failed to update." : "Failed to add financial drama.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label>Financial Drama</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={(val) => field.onChange(val)}
                  className="flex flex-row gap-6"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="mistake" id="type-mistake" />
                    <Label htmlFor="type-mistake">Mistake</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="blessing" id="type-blessing" />
                    <Label htmlFor="type-blessing">Blessing</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <MoneyInput
                  id="amount"
                  name={field.name}
                  value={Number(field.value)}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  aria-invalid={!!formState.errors.amount}
                />
              )}
            />
            {formState.errors.amount && (
              <p className="text-sm text-destructive">
                {formState.errors.amount.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Date</Label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger
                    render={
                      <Button
                        type="button"
                        variant="outline"
                        data-empty={!field.value}
                        className="justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
                      />
                    }
                  >
                    <CalendarIcon />
                    {mounted && field.value ? (
                      format(
                        field.value instanceof Date
                          ? field.value
                          : new Date(field.value),
                        "PPP",
                      )
                    ) : field.value ? (
                      <span>Today</span>
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        field.value instanceof Date
                          ? field.value
                          : new Date(field.value)
                      }
                      onSelect={(date) => field.onChange(date)}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {formState.errors.date && (
              <p className="text-sm text-destructive">
                {formState.errors.date.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Category</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value?.[0] ?? ""}
                  onValueChange={(val) => field.onChange([val])}
                >
                  <SelectTrigger type="button" className="w-full">
                    <SelectValue placeholder="Select Category">
                      {(value) =>
                        categories.find((cat) => cat.value === value)?.label ??
                        "Select Category"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false}>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {formState.errors.category && (
              <p className="text-sm text-destructive">
                {formState.errors.category.message}
              </p>
            )}
          </div>

          {currentType === "blessing" && (
            <div className="flex flex-col gap-2">
              <Label>Account</Label>
              <Controller
                name="blessings_account_id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value?.[0] ?? ""}
                    onValueChange={(val) => field.onChange([val])}
                  >
                    <SelectTrigger type="button" className="w-full">
                      <SelectValue placeholder="Select Account">
                        {(value) =>
                          accounts.find((a) => a.id.toString() === value)
                            ?.name ?? "Select Account"
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={false}>
                      {accounts.map((account) => (
                        <SelectItem
                          key={account.id}
                          value={account.id.toString()}
                        >
                          {account.name} -{" "}
                          {
                            AccountsTypesMap[
                              account.type as keyof typeof AccountsTypesMap
                            ]
                          }
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {formState.errors.blessings_account_id && (
                <p className="text-sm text-destructive">
                  {formState.errors.blessings_account_id.message}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Controller
              name="is_planned"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="is-planned"
                  checked={field.value ?? true}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                />
              )}
            />
            <Label htmlFor="is-planned">Is Planned?</Label>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter notes"
              {...register("notes")}
            />
            {formState.errors.notes && (
              <p className="text-sm text-destructive">
                {formState.errors.notes.message}
              </p>
            )}
          </div>

          <Button type="submit" size="lg" disabled={pending} className="w-full">
            {pending ? "Submitting..." : isEditMode ? "Update" : "Submit"}
          </Button>
        </div>
      </form>
      <Toaster />
    </>
  );
}
