"use client";

import { SignUpFormSchema } from "@/constants";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Form, FormField, Main, Text, TextInput } from "grommet";
import { redirect } from "next/navigation";
import React, { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";

export default function SignInPage() {
  const { register, handleSubmit, formState } = useForm<
    z.infer<typeof SignUpFormSchema>
  >({
    resolver: zodResolver(SignUpFormSchema) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  });

  const [, dispatch, pending] = useActionState(
    async (state: boolean | null, values: z.infer<typeof SignUpFormSchema>) => {
      const { error } = await authClient.signUp.email(
        {
          email: values.email,
          password: values.password,
          name: values.name,
          callbackURL: "/home",
        },
        {
          onSuccess: () => {
            redirect("/home");
          },
          onError: (ctx) => {
            setSignUpErrors(ctx.error.message);
          },
        }
      );

      return error !== null;
    },
    null
  );
  const [signUpErrors, setSignUpErrors] = React.useState<string | null>(null);

  async function onSubmit(values: z.infer<typeof SignUpFormSchema>) {
    startTransition(() => {
      dispatch(values);
    });
  }

  return (
    <Main fill pad="large" justify="center" align="center">
      <Box fill="horizontal">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormField
            name="name"
            htmlFor="name"
            label="Name"
            error={formState.errors.name?.message}
          >
            <TextInput id="name" type="text" {...register("name")} />
          </FormField>
          <FormField
            name="email"
            htmlFor="email"
            label="Email"
            error={formState.errors.email?.message}
          >
            <TextInput id="email" type="email" {...register("email")} />
          </FormField>
          <FormField
            name="password"
            htmlFor="password"
            label="Password"
            error={formState.errors.password?.message}
          >
            <TextInput
              id="password"
              type="password"
              {...register("password")}
            />
          </FormField>
          <FormField
            name="password"
            htmlFor="confirmPassword"
            label="Confirm Password"
            error={formState.errors.confirmPassword?.message}
          >
            <TextInput
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
            />
          </FormField>
          {signUpErrors && (
            <Box margin={{ top: "medium" }}>
              <Text color="red">{signUpErrors}</Text>
            </Box>
          )}
          <Button
            margin={{ top: "medium" }}
            primary
            label="Sign Up"
            type="submit"
            disabled={pending}
            busy={pending}
          />
        </Form>
      </Box>
    </Main>
  );
}
