// ChakraSpringModal.tsx
import React from "react";
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalCloseButton,
  Stack,
  chakra,
} from "@chakra-ui/react";
import { motion, Transition } from "framer-motion";

const MotionOverlay = chakra(motion.div);
const MotionContent = chakra(motion.div);

export interface SpringModalProps {
  isOpen: boolean;
  onClose: () => void;
  showClose: boolean;

  /** Big translucent icon behind everything (e.g. <FiAlertCircle />) */
  bgIcon?: React.ReactNode;
  /** Smaller icon in the white circle above the header */
  frontIcon?: React.ReactNode;
  /** Header text or JSX */
  header: React.ReactNode;
  /** Body text or JSX */
  body: React.ReactNode;

  /** Label for the “secondary” (left) button. */
  secondaryLabel?: string;
  /** Callback for when the secondary button is clicked */
  onSecondaryClick?: () => void;
  /** If true, the secondary button will show a spinner and be disabled */
  isSecondaryLoading?: boolean;

  /** Label for the “primary” (right) button. */
  primaryLabel?: string;
  /** Callback for when the primary button is clicked */
  onPrimaryClick?: () => void;
  /** If true, the primary button will show a spinner and be disabled */
  isPrimaryLoading?: boolean;

  /**
   * If you want a totally custom footer, pass this node instead.
   * If `footer` is defined, the two “primary/secondary” props are ignored.
   */
  footer?: React.ReactNode;

  /** Spread any extra props onto the ModalContent container */
  modalContentProps?: React.ComponentProps<typeof ModalContent>;

  /** Background color (or gradient) if you want to override the default gradient */
  bg?: string;
}

const overlayTransition: Transition = { duration: 0.2, ease: "easeOut" };
const contentTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export const SpringModal: React.FC<SpringModalProps> = ({
  isOpen,
  onClose,
  showClose,
  bgIcon,
  frontIcon,
  header,
  body,
  footer,
  secondaryLabel,
  onSecondaryClick,
  isSecondaryLoading = false,
  primaryLabel,
  onPrimaryClick,
  isPrimaryLoading = false,
  modalContentProps,
  bg,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="none">
      {/* Backdrop */}
      <ModalOverlay
        as={MotionOverlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={overlayTransition as any}
        bg="blackAlpha.600"
        backdropFilter="blur(4px)"
      />

      {/* Modal Content */}
      <ModalContent
        as={MotionContent}
        initial={{ scale: 0, rotate: 12.5, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={{ scale: 0, rotate: 0, opacity: 0 }}
        transition={contentTransition as any}
        bgGradient="linear(to-br, violet.600, indigo.600)"
        color="white"
        borderRadius="lg"
        overflow="hidden"
        maxW="lg"
        mx="4"
        position="relative"
        zIndex={100}
        bg={bg}
        {...modalContentProps}
      >
        {bgIcon && (
          <Box
            position="absolute"
            top="-24"
            left="-6"
            fontSize="12rem"
            opacity={0.1}
            transform="rotate(12deg)"
            zIndex={0}
            pointerEvents="none"
          >
            {bgIcon}
          </Box>
        )}

        <ModalHeader textAlign="center" mb={0} position="relative" zIndex={1}>
          {frontIcon && (
            <Box
              bg="white"
              w="16"
              h="16"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mx="auto"
              mb="2"
              fontSize="3xl"
              color={bg ?? "indigo.600"}
            >
              {frontIcon}
            </Box>
          )}
          <Box as="h3" fontSize="3xl" fontWeight="bold">
            {header}
          </Box>
        </ModalHeader>

        {showClose && (
          <ModalCloseButton
            position="absolute"
            top="2"
            right="2"
            color="white"
            opacity={0.8}
            _hover={{ opacity: 1 }}
            zIndex={2}
          />
        )}

        <ModalBody pt={0} pb={6} position="relative" zIndex={1}>
          <Box textAlign="center">{body}</Box>
        </ModalBody>

        {footer ? (
          <Box position="relative" zIndex={1} pb={6}>
            {footer}
          </Box>
        ) : (
          <ModalFooter position="relative" zIndex={1} pb={6}>
            <Stack w="full" gap={2} direction={["column", "row"]}>
              {secondaryLabel && onSecondaryClick && (
                <Button
                  flex="1"
                  variant="ghost"
                  color="white"
                  onClick={onSecondaryClick}
                  isLoading={isSecondaryLoading}
                  isDisabled={isSecondaryLoading}
                  _hover={{ bg: "whiteAlpha.200" }}
                  py={3}
                >
                  {secondaryLabel}
                </Button>
              )}
              {primaryLabel && onPrimaryClick && (
                <Button
                  flex="1"
                  bg="white"
                  color={bg ?? "indigo.600"}
                  onClick={onPrimaryClick}
                  isLoading={isPrimaryLoading}
                  isDisabled={isPrimaryLoading}
                  _hover={{ opacity: 0.9 }}
                  border="none"
                  py={3}
                >
                  {primaryLabel}
                </Button>
              )}
            </Stack>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};
