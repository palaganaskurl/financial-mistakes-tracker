import { Box, Skeleton } from "grommet";

export default function FinancialDramaSkeleton() {
  return (
    <Box gap="medium">
      <Skeleton height="xxsmall" round="xsmall" />
      <Skeleton height="xxsmall" round="xsmall" />
      <Skeleton height="xxsmall" round="xsmall" />
      <Skeleton height="xxsmall" round="xsmall" />
      <Skeleton height="xxsmall" round="xsmall" />
    </Box>
  );
}
