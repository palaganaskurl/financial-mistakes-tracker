"use client";

import { addAccount } from "@/actions/add-account";
import { AccountTypesCollection } from "@/constants/accounts";
import { Box, Button, Input, Stack, Text } from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";
import { FormEvent, useState } from "react";

export default function AddAccountForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string[]>([]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      await addAccount(formData);
    } catch (error) {
      console.error("Error adding account:", error);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2}>
            Account Name
          </Text>
          <Input
            name="name"
            placeholder="e.g., BDO Savings"
            required
            disabled={isLoading}
          />
        </Box>

        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2}>
            Account Type
          </Text>
          <Select.Root
            collection={AccountTypesCollection}
            value={selectedType}
            onValueChange={(e) => setSelectedType(e.value)}
            name="type"
            required
            disabled={isLoading}
          >
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select type" />
              </Select.Trigger>
            </Select.Control>
            <Select.Positioner>
              <Select.Content>
                {AccountTypesCollection.items.map((item) => (
                  <Select.Item key={item.value} item={item}>
                    {item.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
            <Select.HiddenSelect />
          </Select.Root>
        </Box>

        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2}>
            Starting Balance
          </Text>
          <Input
            name="balance"
            type="number"
            placeholder="0"
            required
            disabled={isLoading}
          />
        </Box>

        <Button type="submit" w="full" disabled={isLoading} loading={isLoading}>
          Add Account
        </Button>
      </Stack>
    </form>
  );
}
