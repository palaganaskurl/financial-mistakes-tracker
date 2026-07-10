import { Link } from "@tanstack/react-router";
import { BarChart3, Home, Plus, Wallet } from "lucide-react";

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[72px] bg-card border-t border-border flex items-center justify-around px-2 z-50">
      <Link
        to="/home"
        activeOptions={{ exact: true }}
        className="flex flex-col items-center gap-1 text-muted-foreground [&.active]:text-primary transition-colors"
        activeProps={{
          className:
            "flex flex-col items-center gap-1 text-primary transition-colors active",
        }}
      >
        <Home size={22} />
        <span className="text-xs font-medium">Home</span>
      </Link>

      <Link
        to="/home/budgets"
        className="flex flex-col items-center gap-1 text-muted-foreground [&.active]:text-primary transition-colors"
        activeProps={{
          className:
            "flex flex-col items-center gap-1 text-primary transition-colors active",
        }}
      >
        <Wallet size={22} />
        <span className="text-xs font-medium">Budget</span>
      </Link>

      <Link
        to="/financial-drama"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-black/15 dark:shadow-black/45 -translate-y-5 active:scale-95 transition-transform ring-4 ring-background"
        aria-label="Add"
      >
        <Plus size={26} />
      </Link>

      <Link
        to="/home/analytics"
        className="flex flex-col items-center gap-1 text-muted-foreground [&.active]:text-primary transition-colors"
        activeProps={{
          className:
            "flex flex-col items-center gap-1 text-primary transition-colors active",
        }}
      >
        <BarChart3 size={22} />
        <span className="text-xs font-medium">Analytics</span>
      </Link>

      <Link
        to="/home/accounts"
        className="flex flex-col items-center gap-1 text-muted-foreground [&.active]:text-primary transition-colors"
        activeProps={{
          className:
            "flex flex-col items-center gap-1 text-primary transition-colors active",
        }}
      >
        <span className="text-lg font-bold leading-none">₱</span>
        <span className="text-xs font-medium">Accounts</span>
      </Link>
    </nav>
  );
}
