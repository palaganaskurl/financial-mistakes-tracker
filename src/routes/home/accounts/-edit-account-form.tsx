import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { MoneyInput } from "#/components/money-input";
import { updateAccount } from "@/actions/update-account";
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

interface Props {
  account: {
    id: string;
    name: string;
    type: string;
    balance: number;
  };
  onCancel: () => void;
}

export default function EditAccountForm({ account, onCancel }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [accountType, setAccountType] = useState(account.type);
  const [balance, setBalance] = useState(account.balance);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name") as string;

      await updateAccount({
        data: {
          id: account.id,
          name,
          type: accountType,
          balance,
        },
      });

      router.invalidate();
      onCancel();
    } catch (error) {
      console.error("Error updating account:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3 pt-3 border-t border-border mt-3">
        <div>
          <Label
            htmlFor={`name-${account.id}`}
            className="mb-1.5 block text-xs"
          >
            Name
          </Label>
          <Input
            id={`name-${account.id}`}
            name="name"
            defaultValue={account.name}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <Label className="mb-1.5 block text-xs">Type</Label>
          <Select
            value={accountType}
            onValueChange={(val) => setAccountType(val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type">
                {(value) =>
                  AccountTypeItems.find((item) => item.value === value)
                    ?.label ?? "Select type"
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
          <Label className="mb-1.5 block text-xs">Balance</Label>
          <MoneyInput
            value={balance}
            onValueChange={setBalance}
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            size="sm"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
