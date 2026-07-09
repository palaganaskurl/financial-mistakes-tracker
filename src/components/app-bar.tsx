import { useMatches, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { RefObject } from "react";
import { useScrollHide } from "@/hooks/use-scroll-hide";
import { UserMenu } from "./user-menu";

const routeTitles: Record<string, string> = {
  "/home/": "Mistakes & Blessings",
  "/home/mistakes/": "All Mistakes",
  "/home/blessings/": "All Blessings",
  "/home/accounts/": "Accounts",
  "/home/budgets/": "Budgets",
  "/home/analytics/": "Analytics",
  "/home/forecast/": "Forecast",
  "/financial-drama/": "Add Entry",
  "/financial-drama/$id": "Edit Entry",
};

function getTitle(routeId: string): string {
  if (routeId === "/financial-drama/$id") return "Edit Entry";

  return routeTitles[routeId] ?? "Financial Drama";
}

function shouldShowBack(routeId: string): boolean {
  if (routeId === "/home/" || routeId === "") return false;

  return true;
}

interface AppBarProps {
  scrollContainerRef: RefObject<HTMLElement | null>;
}

export function AppBar({ scrollContainerRef }: AppBarProps) {
  const visible = useScrollHide(scrollContainerRef);
  const router = useRouter();
  const matches = useMatches();
  const routeId = matches.length > 0 ? matches[matches.length - 1].routeId : "";
  const showBack = shouldShowBack(routeId);
  const title = getTitle(routeId);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 bg-background border-b border-border flex items-center gap-2 px-4 py-4 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div>
        {showBack && (
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                router.history.back();
              } else {
                router.navigate({ to: "/home" });
              }
            }}
            className="p-1 hover:opacity-70 transition-opacity"
          >
            <ArrowLeft size={20} />
          </button>
        )}
      </div>

      <h1 className="flex-1 text-2xl font-bold text-primary">{title}</h1>

      <div className="flex justify-end">
        <UserMenu />
      </div>
    </div>
  );
}
