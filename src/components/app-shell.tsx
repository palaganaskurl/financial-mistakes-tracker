import { useRef, type ReactNode } from "react";
import { AppBar } from "./app-bar";
import { BottomNav } from "./bottom-nav";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-dvh">
      <AppBar scrollContainerRef={scrollRef} />
      <main
        ref={scrollRef}
        className="h-full overflow-y-auto pt-12 pb-20 md:pb-6"
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
