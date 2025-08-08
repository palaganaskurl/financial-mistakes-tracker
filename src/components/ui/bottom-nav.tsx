"use client";

import { Home, Plus, BarChart2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-md md:hidden">
      <div className="relative h-16 flex items-center justify-around">
        <Link
          href="/home"
          className={cn(
            "flex flex-col items-center text-xs text-muted-foreground hover:text-foreground transition",
            isActive("/home") && "text-foreground font-medium"
          )}
        >
          <Home className="w-5 h-5 mb-0.5" />
          Home
        </Link>
        <div className="absolute -top-6">
          <button
            className="rounded-full bg-primary text-primary-foreground p-4 shadow-lg hover:bg-primary/90 transition"
            aria-label="Add"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <Link
          href="/reports"
          className={cn(
            "flex flex-col items-center text-xs text-muted-foreground hover:text-foreground transition",
            isActive("/reports") && "text-foreground font-medium"
          )}
        >
          <BarChart2 className="w-5 h-5 mb-0.5" />
          Reports
        </Link>
      </div>
    </nav>
  );
}
