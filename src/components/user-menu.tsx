import { useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { LogOut, Settings, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const logoutAction = createServerFn({ method: "POST" }).handler(async () => {
  const { useAppSession } = await import("@/lib/session.server");
  const session = await useAppSession();
  await session.clear();
});

export function UserMenu() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleSignOut() {
    setLoggingOut(true);
    try {
      await logoutAction();
      navigate({ to: "/" });
    } catch {
      toast.error("Failed to sign out");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="p-1 hover:opacity-70 transition-opacity text-muted-foreground">
        <Settings size={20} />
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8}>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 px-1 py-1.5">
            <div className="flex size-7 items-center justify-center rounded-none bg-muted text-muted-foreground">
              <User size={14} />
            </div>
            <span className="text-sm font-medium">Account</span>
          </div>
          <div className="border-t border-border my-1" />
          <button
            type="button"
            onClick={handleSignOut}
            disabled={loggingOut}
            className="flex items-center gap-2 px-1 py-1.5 text-sm text-destructive hover:bg-muted transition-colors rounded-none disabled:opacity-50"
          >
            <LogOut size={14} />
            {loggingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
