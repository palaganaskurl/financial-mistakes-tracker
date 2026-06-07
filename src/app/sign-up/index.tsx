import { createFileRoute } from "@tanstack/react-router";
import { SignUpForm } from "./sign-up-form";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-up/")({
  component: SignUpPage,
});

function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-bold mb-2">Create Account</h1>
          <p className="text-sm text-muted-foreground">
            Join us to start tracking your finances
          </p>
        </CardHeader>

        <CardContent>
          <SignUpForm />
        </CardContent>

        <CardFooter className="flex justify-center pt-0">
          <p className="text-sm">
            Already have an account?{" "}
            <Link to="/" className="text-blue-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
