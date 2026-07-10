import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MoneyInput } from "#/components/money-input";
import { completeOnboarding } from "@/actions/complete-onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AccountTypeItems } from "@/constants/accounts";

export function OnboardingForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [accountType, setAccountType] = useState("savings");
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name") as string;

      const result = await completeOnboarding({
        data: { name, type: accountType, balance },
      });

      if (result.success) {
        navigate({ to: "/home" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="name" className="mb-2 block">
          Account Name
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g., BDO Savings"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <Label className="mb-2 block">Account Type</Label>
        <Select
          value={accountType}
          onValueChange={(val) => setAccountType(val as string)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select type">
              {(value) =>
                AccountTypeItems.find((item) => item.value === value)?.label ??
                "Select type"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            {AccountTypeItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="balance" className="mb-2 block">
          Starting Balance
        </Label>
        <MoneyInput
          id="balance"
          name="balance"
          value={balance}
          onValueChange={setBalance}
          disabled={isLoading}
        />
      </div>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border-l-4 border-destructive">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Setting up..." : "Get Started"}
      </Button>
    </form>
  );
}
