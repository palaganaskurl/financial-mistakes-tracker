"use client";

import React, { useState } from "react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
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
  Select,
  createListCollection,
  Portal,
} from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { AccountsTypesMap } from "@/constants/accounts";
import { accountsTable } from "@/db/accounts-schema";

type Accounts = Array<
  Pick<typeof accountsTable.$inferSelect, "id" | "name" | "type">
>;

export default function AddFinancialDramaForm({
  userId,
  accounts,
}: {
  userId: string;
  accounts: Accounts;
}) {
  const { register, handleSubmit, watch, formState, control } = useForm<
    z.infer<typeof FinancialDramaFormSchema>
  >({
    resolver: standardSchemaResolver(FinancialDramaFormSchema),
    defaultValues: {
      type: "mistake",
      amount: 0,
      date: new Date(),
      is_planned: true,
      notes: "",
      category: [],
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

  const mistakeCategoriesCollection = createListCollection({
    items: MistakeCategories,
  });
  const blessingCategoriesCollection = createListCollection({
    items: BlessingCategories,
  });
  const accountsCollection = createListCollection({
    items: accounts.map((account) => ({
      label: `${account.name} - ${AccountsTypesMap[account.type as keyof typeof AccountsTypesMap]}`,
      value: account.id.toString(),
    })),
  });

  const currentType = watch("type");
  const categories =
    currentType === "mistake"
      ? mistakeCategoriesCollection
      : blessingCategoriesCollection;

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
              <Select.Root
                name={field.name}
                value={field.value}
                onValueChange={({ value }) => field.onChange(value)}
                onInteractOutside={() => field.onBlur()}
                collection={categories}
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Select Category" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      {categories.items.map((cat) => (
                        <Select.Item key={cat.value} item={cat.value}>
                          {cat.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
              <Field.ErrorText>
                {formState.errors.category?.message}
              </Field.ErrorText>
            </Field.Root>
          )}
        />

        {currentType === "blessing" && (
          <Controller
            name="blessings_account_id"
            control={control}
            render={({ field }) => (
              <Field.Root invalid={!!formState.errors.blessings_account_id}>
                <Field.Label>Account</Field.Label>
                <Select.Root
                  name={field.name}
                  value={field.value ?? []}
                  onValueChange={({ value }) => field.onChange(value)}
                  onInteractOutside={() => field.onBlur()}
                  collection={accountsCollection}
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select Account" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {accountsCollection.items.map((account) => (
                          <Select.Item key={account.value} item={account.value}>
                            {account.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
                <Field.ErrorText>
                  {formState.errors.blessings_account_id?.message}
                </Field.ErrorText>
              </Field.Root>
            )}
          />
        )}

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
