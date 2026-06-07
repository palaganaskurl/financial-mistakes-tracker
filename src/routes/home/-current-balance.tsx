import { Link } from "@tanstack/react-router";

interface CurrentBalanceProps {
  balance: number;
  label?: string;
  href?: string;
}

export default function CurrentBalance({
  balance,
  label = "Total Balance",
  href,
}: CurrentBalanceProps) {
  const isPositive = balance >= 0;

  const content = (
    <div
      className={`flex-1 rounded-xl border border-border p-4 ${href ? "cursor-pointer hover:border-primary/40 hover:bg-accent/30 transition-all" : ""}`}
    >
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
        {label}
      </p>
      <p
        className={`text-xl font-bold ${isPositive ? "text-primary" : "text-destructive"}`}
      >
        {new Intl.NumberFormat("en-PH", {
          style: "currency",
          currency: "PHP",
        }).format(balance)}
      </p>
    </div>
  );

  if (href) {
    return (
      <Link to={href} className="flex-1">
        {content}
      </Link>
    );
  }

  return content;
}
