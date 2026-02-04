"use client";

import { SignInFormSchema } from "@/constants";
import { signIn } from "@/actions/sign-in";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Card,
  Field,
  Heading,
  Input,
  Stack,
  Text,
  Link as ChakraLink,
  Center,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { toaster } from "@/components/ui/toaster";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState } = useForm<
    z.infer<typeof SignInFormSchema>
  >({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SignInFormSchema>) {
    setIsLoading(true);

    const result = await signIn(values);

    if (result.success) {
      toaster.success({
        title: "Success",
        description: "Signed in successfully",
      });
      router.push("/home");
    } else {
      toaster.error({
        title: "Error",
        description: result.error,
      });
    }

    setIsLoading(false);
  }

  return (
    <Center
      minH="100vh"
      py={{ base: "4", md: "0" }}
      px={{ base: "4", md: "0" }}
    >
      <Card.Root maxW="sm" w="full">
        <Card.Header textAlign="center" pb="6">
          <Heading size="xl" mb="2">
            Welcome Back
          </Heading>
          <Text color="fg.muted" textStyle="sm">
            Sign in to your account to continue
          </Text>
        </Card.Header>

        <Card.Body>
          <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="4">
              <Field.Root invalid={!!formState.errors.email}>
                <Field.Label>Email Address</Field.Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                />
                {formState.errors.email && (
                  <Field.ErrorText>
                    {formState.errors.email.message}
                  </Field.ErrorText>
                )}
              </Field.Root>

              <Field.Root>
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

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                w="full"
                loading={isLoading}
                loadingText="Signing in..."
              >
                Sign In
              </Button>
            </Stack>
          </Box>
        </Card.Body>

        <Card.Footer justifyContent="center" pt="0">
          <Text fontSize="sm">
            Don&apos;t have an account?
            <ChakraLink href="/sign-up" color="blue.600" fontWeight="medium">
              Create one
            </ChakraLink>
          </Text>
        </Card.Footer>
      </Card.Root>
    </Center>
  );
}
