import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { signIn } from "@/actions/sign-in";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignInFormSchema } from "@/constants";

export function SignInForm() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm<
    z.infer<typeof SignInFormSchema>
  >({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [pending, setPending] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  async function onSubmit(values: z.infer<typeof SignInFormSchema>) {
    setPending(true);
    setSignInError(null);

    try {
      const result = await signIn({ data: values });

      if (result.success) {
        navigate({ to: "/home" });
      } else {
        setSignInError(result.error);
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setSignInError(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-1">
          Username
        </label>
        <Input
          id="username"
          type="text"
          placeholder="johndoe"
          {...register("username")}
          className={formState.errors.username ? "border-red-500" : ""}
        />
        {formState.errors.username && (
          <p className="text-red-600 text-sm mt-1">
            {formState.errors.username.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          className={formState.errors.password ? "border-red-500" : ""}
        />
        {formState.errors.password && (
          <p className="text-red-600 text-sm mt-1">
            {formState.errors.password.message}
          </p>
        )}
      </div>

      {signInError && <p className="text-red-600 text-sm">{signInError}</p>}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
