import React from "react";
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  showButtons?: {
    close: boolean;
    confirm: boolean;
  };
  title?: string;
  bodyContent?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

const SurveyModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  showButtons = {
    close: true,
    confirm: true,
  },
  title = "Confirm Action",
  bodyContent = "Are you sure you want to perform this action?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {" "}
      {/* 'isCentered' ensures the modal is centered */}
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex justifyContent={"center"} alignItems={"center"} width={"100%"}>
            {title}
          </Flex>
        </ModalHeader>
        <ModalBody>{bodyContent}</ModalBody>
        <ModalFooter>
          {showButtons.close && (
            <Button
              mr={3}
              onClick={onClose}
              bgColor="darkGray"
              border="1px solid darkGray"
              color="white"
              _hover={{ color: "darkGray", backgroundColor: "white" }}
              display="flex"
              alignItems="center"
              gap={[0, 0, 2]}
              lineHeight={0}
            >
              <CloseIcon />
              {cancelLabel}
            </Button>
          )}
          {showButtons.confirm && (
            <Button
              bgColor="green"
              border="1px solid lightGray"
              color="white"
              _hover={{ color: "green", backgroundColor: "white" }}
              onClick={onConfirm}
              display="flex"
              alignItems="center"
              gap={[0, 0, 2]}
              lineHeight={0}
            >
              <DoneIcon />
              {confirmLabel}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SurveyModal;
