import { ReactNode } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Box,
  Flex,
} from "@chakra-ui/react";
import CloseIcon from "@mui/icons-material/Close"; // MUI icon import

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
          color="white"
          borderTopRadius="md"
          bg="perygonPink"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          {title}
          <Box
            onClick={onClose}
            cursor="pointer"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <CloseIcon />
          </Box>
        </ModalHeader>
        <ModalBody>{body}</ModalBody>
      </ModalContent>
    </Modal>
  );
}
