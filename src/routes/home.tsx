import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { getCurrentUser } from "@/lib/session";

export const Route = createFileRoute("/home")({
  beforeLoad: async () => {
    const user = await getCurrentUser();
    if (!user) {
      throw redirect({ to: "/" });
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
