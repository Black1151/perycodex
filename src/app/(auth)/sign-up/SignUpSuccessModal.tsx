"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";

interface SignUpSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignUpSuccessModal = ({
  isOpen,
  onClose,
}: SignUpSuccessModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent p={5}>
        <VStack gap={8}>
          <ModalHeader>Registration Successful</ModalHeader>
          <ModalBody>
            Your account has been created successfully. Please check your email
            for a verification link.
          </ModalBody>
          <ModalFooter>
            <Button variant="primary" onClick={onClose}>
              Go to Login
            </Button>
          </ModalFooter>
        </VStack>
      </ModalContent>
    </Modal>
  );
};
