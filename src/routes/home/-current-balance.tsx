import { Link } from "@tanstack/react-router";

interface CurrentBalanceProps {
  balance: number;
}

export default function CurrentBalance({ balance }: CurrentBalanceProps) {
  const isPositive = balance >= 0;

  return (
    <Link to="/home/accounts" className="flex-1">
      <div className="rounded-xl border border-border p-4 cursor-pointer hover:border-primary/40 hover:bg-accent/30 transition-all">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
          Today
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
    </Link>
  );
}
