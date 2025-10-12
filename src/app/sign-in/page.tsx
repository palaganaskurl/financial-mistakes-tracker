"use client";

import { SignInFormSchema } from "@/constants";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Form, FormField, Main, Text, TextInput } from "grommet";
import { redirect } from "next/navigation";
import React, { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";

export default function SignInPage() {
  const { register, handleSubmit, formState } = useForm<
    z.infer<typeof SignInFormSchema>
  >({
    resolver: zodResolver(SignInFormSchema) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [, dispatch, pending] = useActionState(
    async (state: boolean | null, values: z.infer<typeof SignInFormSchema>) => {
      const { error } = await authClient.signIn.email(
        {
          email: values.email,
          password: values.password,
          callbackURL: "/home",
        },
        {
          onSuccess: () => {
            redirect("/home");
          },
          onError: (ctx) => {
            setSignInErrors(ctx.error.message);
          },
        }
      );

      return error !== null;
    },
    null
  );
  const [signInErrors, setSignInErrors] = React.useState<string | null>(null);

  async function onSubmit(values: z.infer<typeof SignInFormSchema>) {
    startTransition(() => {
      dispatch(values);
    });
  }

  return (
    <Main fill pad="large" justify="center" align="center">
      <Box fill="horizontal">
        <Form onSubmit={handleSubmit(onSubmit)}>
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
          {signInErrors && (
            <Box margin={{ top: "medium" }}>
              <Text color="red">{signInErrors}</Text>
            </Box>
          )}
          <Button
            margin={{ top: "medium" }}
            primary
            label="Sign IIn"
            type="submit"
            disabled={pending}
            busy={pending}
          />
        </Form>
      </Box>
    </Main>
  );
}
