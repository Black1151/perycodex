import { Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";
import { BigUpStatsCard } from "./masonry/BigUpStatsCard";
import { BigUpStats } from "./types";

export interface UserStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userStats: BigUpStats;
}

export const NewRecognitionModal: React.FC<UserStatsModalProps> = ({
  isOpen,
  onClose,
  userStats,
}) => {
  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent mx={4} borderRadius="lg"></ModalContent>
    </Modal>
  );
};
