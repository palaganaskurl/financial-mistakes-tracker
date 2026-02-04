import { SignUpForm } from "./sign-up-form";
import {
  Card,
  Heading,
  Text,
  Link as ChakraLink,
  Center,
} from "@chakra-ui/react";

export default function SignUpPage() {
  return (
    <Center
      minH="100vh"
      py={{ base: "4", md: "0" }}
      px={{ base: "4", md: "0" }}
    >
      <Card.Root maxW="sm" w="full">
        <Card.Header textAlign="center" pb="6">
          <Heading size="xl" mb="2">
            Create Account
          </Heading>
          <Text color="fg.muted" textStyle="sm">
            Join us to start tracking your finances
          </Text>
        </Card.Header>

        <Card.Body>
          <SignUpForm />
        </Card.Body>

        <Card.Footer justifyContent="center" pt="0">
          <Text fontSize="sm">
            Already have an account?{" "}
            <ChakraLink href="/" color="blue.600" fontWeight="medium">
              Sign in
            </ChakraLink>
          </Text>
        </Card.Footer>
      </Card.Root>
    </Center>
  );
}
