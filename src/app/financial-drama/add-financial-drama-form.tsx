"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod/v4";
import addMistake from "@/actions/add-mistake";
import {
  MistakeCategories,
  FinancialDramaFormSchema,
  BlessingCategories,
} from "@/constants";
import React, { startTransition, useActionState } from "react";
import { redirect } from "next/navigation";

import {
  PageHeader,
  Button,
  Box,
  Form,
  FormField,
  TextInput,
  RadioButtonGroup,
  DateInput,
  Select,
  CheckBox,
  TextArea,
  Notification,
} from "grommet";

export default function AddFinancialDramaForm() {
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
    },
  });

  console.log("formState", formState.errors);

  const [formSubmissionState, dispatch, pending] = useActionState(
    async (
      state: boolean | null,
      values: z.infer<typeof FinancialDramaFormSchema>,
    ) => {
      return await addMistake(values);
    },
    null,
  );

  async function onSubmit(values: z.infer<typeof FinancialDramaFormSchema>) {
    startTransition(() => {
      dispatch(values);
    });
  }

  if (formSubmissionState) {
    setTimeout(() => {
      redirect("/home");
    }, 1500);
  }

  const FinancialDramaRadio = [
    {
      value: "mistake",
      label: "Mistake",
      disabled: false,
      id: "mistake",
    },
    {
      value: "blessing",
      label: "Blessing",
      disabled: false,
      id: "blessing",
    },
  ];

  const currentType = watch("type");
  const categories =
    currentType === "mistake" ? MistakeCategories : BlessingCategories;

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Box gap="medium">
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <FormField name="type" htmlFor="type" label="Financial Drama">
                <RadioButtonGroup
                  id="type"
                  defaultValue="mistake"
                  options={FinancialDramaRadio}
                  {...field}
                />
              </FormField>
            )}
          />
          <FormField
            name="amount"
            htmlFor="amount"
            label="Amount"
            error={formState.errors.amount?.message}
          >
            <TextInput id="amount" type="number" {...register("amount")} />
          </FormField>
          <FormField
            name="date"
            htmlFor="date"
            label="Date"
            error={formState.errors.date?.message}
          >
            <DateInput
              name="date"
              format="mm/dd/yyyy"
              value={new Date().toISOString()}
            />
          </FormField>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <FormField
                name="category"
                htmlFor="category"
                label="Category"
                error={formState.errors.category?.message}
              >
                <Select
                  options={categories}
                  valueKey={{ key: "value", reduce: true }}
                  labelKey="label"
                  {...field}
                />
              </FormField>
            )}
          />
          <FormField name="is_planned" htmlFor="is_planned" label="Is Planned?">
            <CheckBox label="Is Planned?" {...register("is_planned")} />
          </FormField>
          <FormField name="notes" htmlFor="notes" label="Notes">
            <TextArea placeholder="Notes" {...register("notes")} />
          </FormField>
        </Box>
        <Box
          direction="row"
          gap="medium"
          margin={{
            vertical: "medium",
          }}
        >
          <Button
            type="submit"
            primary
            label="Submit"
            disabled={pending}
            busy={pending}
            size="large"
          />
        </Box>
        {formSubmissionState && (
          <Notification
            toast
            status="info"
            title="Success!"
            message="Successfully added financial drama!"
          />
        )}
      </Form>
    </>
  );
}
