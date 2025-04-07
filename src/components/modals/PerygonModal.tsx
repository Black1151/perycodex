import { ReactNode } from "react";
import {
  Box,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

interface PerygonModalProps {
  title: string;
  body: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export function PerygonModal({
  title,
  body,
  isOpen,
  onClose,
}: PerygonModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent borderRadius="md" bg="elementBG">
        <ModalHeader
          color="primaryTextColor"
          width="100%"
          borderTopRadius="md"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {title}
          <Box
            onClick={onClose}
            cursor="pointer"
            display="flex"
            alignItems="center"
            justifyContent="center"
          />
        </ModalHeader>
        <ModalBody textAlign="center" color="elementBG">
          {body}
        </ModalBody>{" "}
      </ModalContent>
    </Modal>
  );
}
