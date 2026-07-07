import { createFileRoute, redirect } from "@tanstack/react-router";
import { getCurrentUser } from "@/lib/session";
import { OnboardingForm } from "./-onboarding-form";

export const Route = createFileRoute("/home/onboarding/")({
  beforeLoad: async () => {
    const user = await getCurrentUser();
    if (!user) {
      throw redirect({ to: "/" });
    }
    return { user };
  },
  component: OnboardingPage,
});

function OnboardingPage() {
  const { user } = Route.useRouteContext();

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">
            Welcome, {user.name}!
          </h1>
          <p className="text-sm text-muted-foreground">
            Let's set up your first account to get started
          </p>
        </div>

        <OnboardingForm />
      </div>
    </div>
  );
}
