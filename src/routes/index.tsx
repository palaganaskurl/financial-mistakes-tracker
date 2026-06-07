import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { SignInForm } from "./-sign-in-form";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </CardHeader>

        <CardContent>
          <SignInForm />
        </CardContent>

        <CardFooter className="flex justify-center pt-0">
          <p className="text-sm">
            Don't have an account?{" "}
            <Link
              to="/sign-up"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
