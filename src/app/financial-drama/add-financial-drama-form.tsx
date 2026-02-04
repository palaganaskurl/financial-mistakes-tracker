"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod/v4";
import addMistake from "@/actions/add-mistake";
import {
  MistakeCategories,
  FinancialDramaFormSchema,
  BlessingCategories,
} from "@/constants";
import { redirect } from "next/navigation";
import {
  Box,
  Stack,
  Input,
  Textarea,
  Button,
  HStack,
  Field,
  RadioGroup,
  Checkbox,
  NativeSelect,
} from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";

export default function AddFinancialDramaForm({ userId }: { userId: string }) {
  const { register, handleSubmit, watch, formState, control } = useForm<
    z.infer<typeof FinancialDramaFormSchema>
  >({
    resolver: zodResolver(FinancialDramaFormSchema) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    defaultValues: {
      type: "mistake",
      amount: 0,
      date: new Date(),
      is_planned: true,
      notes: "",
      user_id: userId,
    },
  });

  const [pending, setPending] = useState(false);

  async function onSubmit(values: z.infer<typeof FinancialDramaFormSchema>) {
    setPending(true);
    try {
      const result = await addMistake(values);
      if (result) {
        toaster.create({
          title: "Success!",
          description: "Successfully added financial drama!",
          type: "success",
          duration: 3000,
        });
        setTimeout(() => {
          redirect("/home");
        }, 1000);
      } else {
        toaster.create({
          title: "Error",
          description: "Failed to add financial drama.",
          type: "error",
          duration: 3000,
        });
      }
    } finally {
      setPending(false);
    }
  }

  const currentType = watch("type");
  const categories =
    currentType === "mistake" ? MistakeCategories : BlessingCategories;

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={6}>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Field.Root>
              <Field.Label>Financial Drama</Field.Label>
              <RadioGroup.Root
                value={field.value}
                onValueChange={(details) => field.onChange(details.value)}
              >
                <HStack gap={4}>
                  <RadioGroup.Item value="mistake">
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemControl>
                      <RadioGroup.ItemIndicator />
                    </RadioGroup.ItemControl>
                    <RadioGroup.ItemText>Mistake</RadioGroup.ItemText>
                  </RadioGroup.Item>
                  <RadioGroup.Item value="blessing">
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemControl>
                      <RadioGroup.ItemIndicator />
                    </RadioGroup.ItemControl>
                    <RadioGroup.ItemText>Blessing</RadioGroup.ItemText>
                  </RadioGroup.Item>
                </HStack>
              </RadioGroup.Root>
            </Field.Root>
          )}
        />

        <Field.Root invalid={!!formState.errors.amount}>
          <Field.Label>Amount</Field.Label>
          <Input
            type="number"
            placeholder="Enter amount"
            {...register("amount", { valueAsNumber: true })}
          />
          <Field.ErrorText>{formState.errors.amount?.message}</Field.ErrorText>
        </Field.Root>

        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <Field.Root invalid={!!formState.errors.date}>
              <Field.Label>Date</Field.Label>
              <Input
                type="date"
                value={
                  field.value instanceof Date
                    ? field.value.toISOString().split("T")[0]
                    : field.value
                }
                onChange={(e) => field.onChange(new Date(e.target.value))}
              />
              <Field.ErrorText>
                {formState.errors.date?.message}
              </Field.ErrorText>
            </Field.Root>
          )}
        />

        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Field.Root invalid={!!formState.errors.category}>
              <Field.Label>Category</Field.Label>
              <NativeSelect.Root>
                <NativeSelect.Field
                  placeholder="Select category"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
              <Field.ErrorText>
                {formState.errors.category?.message}
              </Field.ErrorText>
            </Field.Root>
          )}
        />

        <Controller
          name="is_planned"
          control={control}
          render={({ field }) => (
            <Field.Root>
              <Checkbox.Root
                checked={field.value}
                onCheckedChange={(details) => field.onChange(details.checked)}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>Is Planned?</Checkbox.Label>
              </Checkbox.Root>
            </Field.Root>
          )}
        />

        <Field.Root invalid={!!formState.errors.notes}>
          <Field.Label>Notes</Field.Label>
          <Textarea placeholder="Enter notes" {...register("notes")} />
          <Field.ErrorText>{formState.errors.notes?.message}</Field.ErrorText>
        </Field.Root>

        <Button
          type="submit"
          colorPalette="blue"
          size="lg"
          loading={pending}
          disabled={pending}
        >
          Submit
        </Button>
      </Stack>
      <Toaster />
    </Box>
  );
}
