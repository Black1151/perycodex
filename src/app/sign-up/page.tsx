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
  useToast,
} from "@chakra-ui/react";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { SubmitHandler } from "react-hook-form";
import axios from "axios";
import { LoginCard } from "@/components/login/LoginCard";
import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";
import { SignUpForm, SignUpFormInputs } from "@/components/forms/SignUpForm";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/auth/sign-up", data);
      if (response.status === 200) {
        onOpen();
      }
    } catch (error: any) {
      toast({
        title: "Sorry, sign up failed!",
        description: error.response?.data?.error || "Account creation failed.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    router.push("/login");
  };

  return (
    <PerygonContainer>
      <Center flex={1}>
        <LoginCard
          titleComponent={
            <VStack position="absolute" top="90px">
              <LetterFlyIn fontSize={70}>Create</LetterFlyIn>
              <LetterFlyIn fontSize={70}>Account</LetterFlyIn>
            </VStack>
          }
        >
          <SignUpForm
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
            <ModalHeader>Registration Successful</ModalHeader>
            <ModalBody>
              Your account has been created successfully. Please check your
              email for a verification link.
            </ModalBody>
            <ModalFooter>
              <Button variant="primary" onClick={handleClose}>
                Go to Login
              </Button>
            </ModalFooter>
          </VStack>
        </ModalContent>
      </Modal>
    </PerygonContainer>
  );
}
