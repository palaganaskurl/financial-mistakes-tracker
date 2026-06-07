import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod/v4";
import { signUp } from "@/actions/sign-up";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignUpFormSchema } from "@/constants";

export function SignUpForm() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm<
    z.infer<typeof SignUpFormSchema>
  >({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      username: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [pending, setPending] = useState(false);
  const [signUpErrors, setSignUpErrors] = useState<string | null>(null);

  async function onSubmit(values: z.infer<typeof SignUpFormSchema>) {
    setPending(true);
    setSignUpErrors(null);

    try {
      const result = await signUp({ data: values });

      if (result.success) {
        navigate({ to: "/home" });
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-1">
          Username
        </label>
        <Input
          id="username"
          type="text"
          placeholder="Username"
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
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Full Name
        </label>
        <Input
          id="name"
          type="text"
          placeholder="Full name"
          {...register("name")}
          className={formState.errors.name ? "border-red-500" : ""}
        />
        {formState.errors.name && (
          <p className="text-red-600 text-sm mt-1">
            {formState.errors.name.message}
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

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium mb-1"
        >
          Confirm Password
        </label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          {...register("confirmPassword")}
          className={formState.errors.confirmPassword ? "border-red-500" : ""}
        />
        {formState.errors.confirmPassword && (
          <p className="text-red-600 text-sm mt-1">
            {formState.errors.confirmPassword.message}
          </p>
        )}
      </div>

      {signUpErrors && (
        <div className="p-3 rounded-md bg-red-50 border-l-4 border-red-500">
          <p className="text-red-700 text-sm">{signUpErrors}</p>
        </div>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Creating account..." : "Sign Up"}
      </Button>
    </form>
  );
}
