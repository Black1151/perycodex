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
  userStats,
}) => {
  console.log(userStats);
  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent mx={4} borderRadius="lg">
        <BigUpStatsCard
          name={userStats.userName}
          location={userStats.userLocation}
          received={userStats.bigUpReceivedPoints}
          given={userStats.bigUpGivenPoints}
          score={userStats.bigUpTotal}
          userImage={userStats.userImage}
          ranking={userStats.bigUpRanking}
        />
      </ModalContent>
    </Modal>
  );
};
