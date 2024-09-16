import { Center, VStack } from "@chakra-ui/react";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { LoginCard } from "@/components/login/LoginCard";
import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";
import { ActivateAccountForm } from "@/components/forms/ActivateAccountForm";
import { redirect } from "next/navigation";

interface ActivateAccountPageProps {
  searchParams: { token?: string };
}

export default function ActivateAccountPage({
  searchParams,
}: ActivateAccountPageProps) {
  const token = searchParams.token!;

  if (!token) {
    redirect("/login");
  }

  return (
    <PerygonContainer>
      <Center flex={1}>
        <LoginCard
          titleComponent={
            <VStack position="absolute" top="90px">
              <LetterFlyIn fontSize={40}>Welcome to Perygon!</LetterFlyIn>
              <LetterFlyIn fontSize={35}>Please set up</LetterFlyIn>
              <LetterFlyIn fontSize={35}>Your password</LetterFlyIn>
            </VStack>
          }
        >
          <ActivateAccountForm token={token} isSubmitting={false} errors={{}} />
        </LoginCard>
      </Center>
    </PerygonContainer>
  );
}
