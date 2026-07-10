import { useRouter } from "@tanstack/react-router";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { MoneyInput } from "#/components/money-input";
import { addTransfer } from "@/actions/add-transfer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AccountsTypesMap } from "@/constants/accounts";

interface Account {
  id: string;
  name: string;
  type: string;
}

export default function AddTransferForm({ accounts }: { accounts: Account[] }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState<Date>(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fromAccountId || !toAccountId || fromAccountId === toAccountId) return;

    setIsLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await addTransfer({
        data: {
          from_account_id: fromAccountId,
          to_account_id: toAccountId,
          amount,
          date: format(date, "yyyy-MM-dd"),
          notes: (formData.get("notes") as string) || undefined,
        },
      });

      setFromAccountId("");
      setToAccountId("");
      setAmount(0);
      setDate(new Date());
      router.invalidate();
    } catch (error) {
      console.error("Error adding transfer:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <div>
          <Label className="mb-2 block">From</Label>
          <Select value={fromAccountId} onValueChange={setFromAccountId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select account">
                {(value) =>
                  accounts.find((a) => a.id === value)?.name ?? "Select account"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name} —{" "}
                  {
                    AccountsTypesMap[
                      account.type as keyof typeof AccountsTypesMap
                    ]
                  }
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block">To</Label>
          <Select value={toAccountId} onValueChange={setToAccountId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select account">
                {(value) =>
                  accounts.find((a) => a.id === value)?.name ?? "Select account"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              {accounts
                .filter((a) => a.id !== fromAccountId)
                .map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name} —{" "}
                    {
                      AccountsTypesMap[
                        account.type as keyof typeof AccountsTypesMap
                      ]
                    }
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block">Amount</Label>
          <MoneyInput
            value={amount}
            onValueChange={setAmount}
            disabled={isLoading}
          />
        </div>

        <div>
          <Label className="mb-2 block">Date</Label>
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  data-empty={!date}
                  className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
                />
              }
            >
              <CalendarIcon />
              {mounted ? format(date, "PPP") : <span>Pick a date</span>}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="transfer-notes" className="mb-2 block">
            Notes
          </Label>
          <Textarea
            id="transfer-notes"
            name="notes"
            placeholder="Optional notes"
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !fromAccountId || !toAccountId || amount <= 0}
        >
          {isLoading ? "Transferring..." : "Transfer"}
        </Button>
      </div>
    </form>
  );
}
