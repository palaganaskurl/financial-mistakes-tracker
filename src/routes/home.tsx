import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { BottomNav } from "@/components/bottom-nav";
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
    <>
      <Outlet />
      <BottomNav />
    </>
  );
}
