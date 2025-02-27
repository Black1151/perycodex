import { Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";
import { BigUpStatsCard } from "./masonry/BigUpStatsCard";
import { BigUpStats } from "./types";

export interface UserStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userStats: BigUpStats;
}

export const UserStatsModal: React.FC<UserStatsModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <BigUpStatsCard
          name={""}
          location={""}
          received={0}
          given={0}
          score={0}
          userImage={""}
        />
      </ModalContent>
    </Modal>
  );
};
