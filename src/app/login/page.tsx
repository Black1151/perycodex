import { Center, VStack } from "@chakra-ui/react";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { LoginForm } from "../../components/forms/LoginForm";
import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";
import { LoginCard } from "../../components/login/LoginCard";

export default function LoginPage() {
  return (
    <PerygonContainer>
      <Center flex={1}>
        <LoginCard
          imageOffset={-421}
          titleComponent={
            <VStack position="absolute" top="100px">
              <LetterFlyIn>Perygonnnnz</LetterFlyIn>
            </VStack>
          }
        >
          <LoginForm isSubmitting={false} errors={{}} />
        </LoginCard>
      </Center>
    </PerygonContainer>
  );
}
