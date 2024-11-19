import {
  Box,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { AccountTree } from "@mui/icons-material";
import { useState } from "react";
import { useWorkflow } from "@/providers/WorkflowProvider";

export const WorkflowModal = () => {
  const { workflowId, toolId, toolPath, toolLogo } = useWorkflow();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  // Helper function to format values
  const formatValue = (label: string, value: string | null | undefined) =>
    `${label}: ${value ?? "Nothing at all"}`;

  return (
    <>
      {/* Icon button to open the modal */}
      <IconButton
        aria-label="Open Workflow Details"
        icon={<AccountTree />}
        onClick={handleOpen}
        position="fixed"
        bottom="20px"
        right="80px"
        zIndex={1000}
        colorScheme="teal"
        size="lg"
        borderRadius="full"
      />

      {/* Modal to display user data side by side */}
      <Modal isOpen={isOpen} onClose={handleClose} size="3xl">
        <ModalOverlay />
        <ModalContent maxH={"80%"} overflow={"auto"}>
          <ModalHeader>Workflow Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex gap={6}>
              {/* Workflow Context Data */}
              <Box flex="1" p={4} bg="gray.50" borderRadius="md">
                <Text fontWeight="bold" mb={2}>
                  Workflow Context
                </Text>
                <Box
                  as="pre"
                  fontSize="sm"
                  whiteSpace="pre-wrap"
                  wordBreak="break-word"
                >
                  {formatValue("Workflow ID", workflowId)}
                  {"\n"}
                  {formatValue("Tool ID", toolId)}
                  {"\n"}
                  {formatValue("Tool Path", toolPath)}
                  {"\n"}
                  {formatValue("Tool Logo", toolLogo)}
                </Box>
              </Box>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
