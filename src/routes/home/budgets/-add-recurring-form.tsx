import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { MoneyInput } from "#/components/money-input";
import { addRecurring } from "@/actions/add-recurring";
import { updateRecurring } from "@/actions/update-recurring";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  BlessingCategories,
  MistakeCategories,
  RecurringFormSchema,
  RecurringFrequencies,
} from "@/constants";

type RecurringFormInput = z.input<typeof RecurringFormSchema>;
type RecurringFormValues = z.output<typeof RecurringFormSchema>;

interface InitialData {
  id: string;
  name: string;
  type: "mistake" | "blessing";
  amount: number;
  category: string;
  frequency: "weekly" | "monthly" | "yearly";
  start_date: string;
  end_date?: string | null;
  is_active: boolean;
}

export default function AddRecurringForm({
  initialData,
  onSuccess,
}: {
  initialData?: InitialData;
  onSuccess?: () => void;
}) {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isEditMode = !!initialData;

  const { register, handleSubmit, watch, formState, control } = useForm<
    RecurringFormInput,
    unknown,
    RecurringFormValues
  >({
    resolver: zodResolver(RecurringFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          type: initialData.type,
          amount: initialData.amount,
          category: [initialData.category],
          frequency: initialData.frequency,
          start_date: new Date(initialData.start_date),
          end_date: initialData.end_date
            ? new Date(initialData.end_date)
            : undefined,
          is_active: initialData.is_active,
        }
      : {
          type: "mistake",
          amount: 0,
          is_active: true,
          category: [],
        },
  });

  const currentType = watch("type");
  const categories =
    currentType === "mistake" ? MistakeCategories : BlessingCategories;

  useEffect(() => {
    setMounted(true);
  }, []);

  async function onSubmit(values: RecurringFormValues) {
    setPending(true);
    try {
      const payload = {
        name: values.name,
        type: values.type,
        amount: values.amount,
        category: values.category[0],
        frequency: values.frequency,
        start_date:
          values.start_date instanceof Date
            ? format(values.start_date, "yyyy-MM-dd")
            : values.start_date,
        end_date:
          values.end_date instanceof Date
            ? format(values.end_date, "yyyy-MM-dd")
            : values.end_date,
        is_active: values.is_active,
      };

      if (isEditMode && initialData) {
        await updateRecurring({ data: { id: initialData.id, ...payload } });
        toast.success("Recurring updated!");
      } else {
        await addRecurring({ data: payload });
        toast.success("Recurring added!");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate({ to: "/home/budgets" });
      }
    } catch {
      toast.error(isEditMode ? "Failed to update." : "Failed to add.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g. Netflix, Salary"
              {...register("name")}
            />
            {formState.errors.name && (
              <p className="text-sm text-destructive">
                {formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Type</Label>
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
                    <RadioGroupItem value="mistake" id="r-type-mistake" />
                    <Label htmlFor="r-type-mistake">Mistake</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="blessing" id="r-type-blessing" />
                    <Label htmlFor="r-type-blessing">Blessing</Label>
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

          <div className="flex flex-col gap-2">
            <Label>Frequency</Label>
            <Controller
              name="frequency"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  onValueChange={(val) => field.onChange(val)}
                >
                  <SelectTrigger type="button" className="w-full">
                    <SelectValue placeholder="Select Frequency">
                      {(value) =>
                        RecurringFrequencies.find((f) => f.value === value)
                          ?.label ?? "Select Frequency"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false}>
                    {RecurringFrequencies.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {formState.errors.frequency && (
              <p className="text-sm text-destructive">
                {formState.errors.frequency.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Start Date</Label>
            <Controller
              name="start_date"
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
                    ) : (
                      <span>Pick a start date</span>
                    )}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        field.value instanceof Date
                          ? field.value
                          : field.value
                            ? new Date(field.value)
                            : undefined
                      }
                      onSelect={(date) => field.onChange(date)}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {formState.errors.start_date && (
              <p className="text-sm text-destructive">
                {formState.errors.start_date.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>End Date (optional)</Label>
            <Controller
              name="end_date"
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
                    ) : (
                      <span>No end date</span>
                    )}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        field.value instanceof Date
                          ? field.value
                          : field.value
                            ? new Date(field.value)
                            : undefined
                      }
                      onSelect={(date) => field.onChange(date)}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>

          <div className="flex items-center gap-2">
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="is-active"
                  checked={field.value ?? true}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                />
              )}
            />
            <Label htmlFor="is-active">Active</Label>
          </div>

          <Button type="submit" size="lg" disabled={pending} className="w-full">
            {pending
              ? "Submitting..."
              : isEditMode
                ? "Update"
                : "Add Recurring"}
          </Button>
        </div>
      </form>
    </>
  );
}
