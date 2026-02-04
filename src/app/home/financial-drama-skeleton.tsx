import { Stack, Skeleton } from "@chakra-ui/react";

export default function FinancialDramaSkeleton() {
  return (
    <Stack gap={3}>
      <Skeleton height="40px" borderRadius="md" />
      <Skeleton height="40px" borderRadius="md" />
      <Skeleton height="40px" borderRadius="md" />
      <Skeleton height="40px" borderRadius="md" />
      <Skeleton height="40px" borderRadius="md" />
    </Stack>
  );
}
