import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { AppShell } from "@/components/app-shell";
import { user } from "@/db/auth-schema";
import { getDb } from "@/db/d1";
import { getCurrentUser } from "@/lib/session";

const checkOnboarding = createServerFn({ method: "GET" }).handler(
  async ({ context }) => {
    const { useAppSession } = await import("@/lib/session.server");
    const session = await useAppSession();

    if (!session.data.userId) {
      return { onboardingCompleted: true };
    }

    const db = getDb(context);
    const [currentUser] = await db
      .select({ onboardingCompleted: user.onboardingCompleted })
      .from(user)
      .where(eq(user.id, session.data.userId));

    return {
      onboardingCompleted: currentUser
        ? Boolean(currentUser.onboardingCompleted)
        : true,
    };
  },
);

export const Route = createFileRoute("/home")({
  beforeLoad: async ({ location }) => {
    const user = await getCurrentUser();
    if (!user) {
      throw redirect({ to: "/" });
    }

    if (location.pathname !== "/home/onboarding") {
      const { onboardingCompleted } = await checkOnboarding();
      if (!onboardingCompleted) {
        throw redirect({ to: "/home/onboarding" });
      }
    }

    return { user };
  },
  component: HomeLayout,
});

function HomeLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
