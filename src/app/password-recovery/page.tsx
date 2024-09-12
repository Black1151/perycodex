"use client";

import { useState } from "react";
import {
  Center,
  VStack,
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { SubmitHandler } from "react-hook-form";
import axios from "axios";
import { LoginCard } from "@/components/login/LoginCard";
import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";
import { SignUpFormInputs } from "@/components/forms/SignUpForm";
import { PasswordRecoveryForm } from "@/components/forms/PasswordRecoveryForm";
import { useRouter } from "next/navigation";

export default function PasswordRecoveryPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    setIsSubmitting(true);
    await axios.post("/api/auth/password-recovery", data);
    onOpen();
    setIsSubmitting(true);
  };

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
          <PasswordRecoveryForm
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            errors={{}}
          />
        </LoginCard>
      </Center>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent p={5}>
          <VStack gap={8}>
            <ModalHeader>Password reset request sent</ModalHeader>
            <ModalBody>
              If the email address given is registered with us you will get an
              email containing a link in the next few minutes.
            </ModalBody>
            <ModalFooter>
              <Button variant="primary" onClick={() => router.push("/login")}>
                To Login
              </Button>
            </ModalFooter>
          </VStack>
        </ModalContent>
      </Modal>
    </PerygonContainer>
  );
}
