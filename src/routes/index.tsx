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
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-background">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-5">
            <span className="text-3xl font-bold text-primary">₱</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Financial Drama
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Track your chaos. One mistake at a time.
          </p>
        </div>

        <Card className="border-border bg-card shadow-2xl">
          <CardHeader className="pb-2">
            <h2 className="text-lg font-semibold">Welcome back</h2>
            <p className="text-sm text-muted-foreground">Sign in to continue</p>
          </CardHeader>

          <CardContent>
            <SignInForm />
          </CardContent>

          <CardFooter className="flex justify-center py-6">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/sign-up"
                className="text-primary font-medium hover:underline"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
