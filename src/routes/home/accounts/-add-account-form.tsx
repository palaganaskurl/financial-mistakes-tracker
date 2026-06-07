import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { addAccount } from "@/actions/add-account";
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

export default function AddAccountForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [accountType, setAccountType] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name") as string;
      const balance = Number(formData.get("balance"));

      await addAccount({
        data: {
          name,
          type: accountType,
          balance,
        },
      });

      router.invalidate();
    } catch (error) {
      console.error("Error adding account:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
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
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
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
          <Input
            id="balance"
            name="balance"
            type="number"
            placeholder="0"
            required
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !accountType}
        >
          {isLoading ? "Adding..." : "Add Account"}
        </Button>
      </div>
    </form>
  );
}
