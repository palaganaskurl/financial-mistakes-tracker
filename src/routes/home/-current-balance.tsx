import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";

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
    <Card
      className={`flex-1 px-4 ${href ? "cursor-pointer hover:ring-primary/40 hover:bg-accent/30 transition-all" : ""}`}
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
    </Card>
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
