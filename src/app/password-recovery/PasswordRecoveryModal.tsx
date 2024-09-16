"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  VStack,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

interface PasswordRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PasswordRecoveryModal = ({
  isOpen,
  onClose,
}: PasswordRecoveryModalProps) => {
  const router = useRouter();

  return (
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
  );
};
