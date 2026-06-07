import { Link } from "@tanstack/react-router";
import { Home, Plus, Wallet } from "lucide-react";

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t border-gray-200 flex items-center justify-around px-6 z-50">
      <Link
        to="/home"
        activeOptions={{ exact: true }}
        className="flex flex-col items-center gap-1 text-gray-400 [&.active]:text-black transition-colors"
        activeProps={{
          className:
            "flex flex-col items-center gap-1 text-black transition-colors active",
        }}
      >
        <Home size={22} />
        <span className="text-xs font-medium">Home</span>
      </Link>

      <Link
        to="/financial-drama"
        className="flex items-center justify-center w-16 h-16 rounded-full bg-black text-white shadow-xl -translate-y-5 active:scale-95 transition-transform ring-4 ring-white"
        aria-label="Add"
      >
        <Plus size={28} />
      </Link>

      <Link
        to="/home/accounts"
        className="flex flex-col items-center gap-1 text-gray-400 [&.active]:text-black transition-colors"
        activeProps={{
          className:
            "flex flex-col items-center gap-1 text-black transition-colors active",
        }}
      >
        <Wallet size={22} />
        <span className="text-xs font-medium">Accounts</span>
      </Link>
    </nav>
  );
}
