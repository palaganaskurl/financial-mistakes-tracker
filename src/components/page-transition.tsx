import { useRouterState } from "@tanstack/react-router";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const href = useRouterState({ select: (s) => s.location.href });

  return (
    <div
      key={href}
      className="[view-transition-name:page-content] animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      {children}
    </div>
  );
}
