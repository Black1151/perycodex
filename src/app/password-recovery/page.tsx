// PasswordRecoveryPage.tsx (Server Component)

import { redirect } from "next/navigation";
import { Center, VStack } from "@chakra-ui/react";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { LoginCard } from "@/components/login/LoginCard";
import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";
import { PasswordRecoveryPageClient } from "./PasswordRecoveryPageClient";

export default function PasswordRecoveryPage() {
  return (
    <PerygonContainer>
      <Center flex={1}>
        <LoginCard
          titleComponent={
            <VStack position="absolute" top="60px">
              <LetterFlyIn fontSize={70}>Password</LetterFlyIn>
              <LetterFlyIn fontSize={70}>Recovery</LetterFlyIn>
            </VStack>
          }
        >
          <PasswordRecoveryPageClient />
        </LoginCard>
      </Center>
    </PerygonContainer>
  );
}
