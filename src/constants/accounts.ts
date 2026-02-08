import { createListCollection } from "@chakra-ui/react";

export const AccountsTypesMap = {
  savings: "Savings Account",
  checking: "Checking Account",
  credit_card: "Credit Card",
  investment: "Investment",
  other: "Other",
};

export const AccountTypesCollection = createListCollection({
  items: Object.entries(AccountsTypesMap).map(([value, label]) => ({
    label,
    value,
  })),
});
