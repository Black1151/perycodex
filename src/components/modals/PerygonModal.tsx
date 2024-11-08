import { ReactNode } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Box,
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
      <ModalContent borderRadius="md">
        <ModalHeader
          color="black"
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
          ></Box>
        </ModalHeader>
        <ModalBody textAlign="center">{body}</ModalBody>{" "}
      </ModalContent>
    </Modal>
  );
}
