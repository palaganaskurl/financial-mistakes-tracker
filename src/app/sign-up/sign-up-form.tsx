"use client";

import { SignUpFormSchema } from "@/constants";
import { signUp } from "@/actions/sign-up";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Field, Input, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";

export function SignUpForm() {
  const router = useRouter();
  const { register, handleSubmit, formState } = useForm<
    z.infer<typeof SignUpFormSchema>
  >({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  });

  const [pending, setPending] = useState(false);
  const [signUpErrors, setSignUpErrors] = useState<string | null>(null);

  async function onSubmit(values: z.infer<typeof SignUpFormSchema>) {
    setPending(true);
    setSignUpErrors(null);

    try {
      const result = await signUp(values);

      if (result.success) {
        router.push("/home");
      } else if (!result.success) {
        setSignUpErrors(result.error);
      }
    } catch (error) {
      console.error("Sign up error:", error);
      setSignUpErrors(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="4">
        <Field.Root invalid={!!formState.errors.name}>
          <Field.Label>Full Name</Field.Label>
          <Input type="text" placeholder="John Doe" {...register("name")} />
          {formState.errors.name && (
            <Field.ErrorText>{formState.errors.name.message}</Field.ErrorText>
          )}
        </Field.Root>

        <Field.Root invalid={!!formState.errors.email}>
          <Field.Label>Email Address</Field.Label>
          <Input
            type="email"
            placeholder="you@example.com"
            {...register("email")}
          />
          {formState.errors.email && (
            <Field.ErrorText>{formState.errors.email.message}</Field.ErrorText>
          )}
        </Field.Root>

        <Field.Root invalid={!!formState.errors.password}>
          <Field.Label>Password</Field.Label>
          <Input
            type="password"
            placeholder="••••••••"
            {...register("password")}
          />
          {formState.errors.password && (
            <Field.ErrorText>
              {formState.errors.password.message}
            </Field.ErrorText>
          )}
        </Field.Root>

        <Field.Root invalid={!!formState.errors.confirmPassword}>
          <Field.Label>Confirm Password</Field.Label>
          <Input
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword")}
          />
          {formState.errors.confirmPassword && (
            <Field.ErrorText>
              {formState.errors.confirmPassword.message}
            </Field.ErrorText>
          )}
        </Field.Root>

        {signUpErrors && (
          <Box
            p="3"
            borderRadius="md"
            bg="red.50"
            borderLeft="4px solid"
            borderColor="red.500"
          >
            <Text color="red.700" fontSize="sm">
              {signUpErrors}
            </Text>
          </Box>
        )}

        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          w="full"
          loading={pending}
          loadingText="Creating account..."
        >
          Sign Up
        </Button>
      </Stack>
    </Box>
  );
}
