"use client";

import React, { useState } from "react";
import { SpringScale } from "@/components/animations/SpringScale";
import {
  Grid,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Flex,
} from "@chakra-ui/react";
import { BigUpMasonry, BigUpMasonryProps } from "./masonry/BigUpMasonry";
import { PerygonTabs } from "./tabs/PerygonTabs";
import SubmitScoreModal from "./SubmitScoreModal";
import { BigUpCategory, BigUpStats, BigUpTeamMember } from "./types";
import { useUser } from "@/providers/UserProvider";
import Confetti from "@/components/animations/confetti/Confetti";
import RecognitionHeader from "./RecognitionHeader";
import { useRouter } from "next/navigation";
import { UserStatsModal } from "./UserStatsModal";

interface PageClientInnerProps {
  masonryData: BigUpMasonryProps;
  tabsData: { header: string; content: JSX.Element }[];
  modalData: {
    teamMembers: BigUpTeamMember[];
    categories: BigUpCategory[];
  };
  onDataUpdated: () => void;
}

export const PageClientInner: React.FC<PageClientInnerProps> = ({
  masonryData,
  tabsData,
  modalData,
  onDataUpdated,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserStatsModalOpen, setIsUserStatsModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [userStats, setUserStats] = useState<BigUpStats>({
    bigUpGivenPoints: 0,
    bigUpReceivedPoints: 0,
    bigUpTotal: 0,
    bigUpRanking: 0,
    userName: '',
    userLocation: '',
    userImage: ''
  });

  const router = useRouter();
  const { user } = useUser();

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = async (formData: {
    teamMember: string;
    category: string;
    message: string;
  }) => {
    setIsModalOpen(false);

    try {
      const response = await fetch("/api/auth/big-up/submitBigUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromUserId: user?.userId,
          toUserId: formData.teamMember,
          reason: formData.message,
          bigupTypeId: formData.category,
          customerId: user?.customerId,
        }),
      });

      await response.json();
      onDataUpdated();
      setShowSuccessModal(true);
      setShowConfetti(true);

      setTimeout(() => {
        setShowSuccessModal(false);
        setShowConfetti(false);
        router.refresh();
      }, 3000);
    } catch (error) {
      console.error("Error submitting BigUp:", error);
    }
  };

  const fetchUserStats = async (uuid: string) => {
    const response = await fetch(
      `/api/auth/big-up/fetchBigUpUserData?uuid=${uuid}`
    );
    const data = await response.json();
    setUserStats(data);
  };

  return (
    <>
      <Flex
        bg="perygonBlueTransparent"
        w={"full"}
        alignItems="center"
        borderRadius={"lg"}
        p={2}
        pr={6}
      >
        <RecognitionHeader
          headingText={"Recognition Hub"}
          onAddButtonClick={handleButtonClick}
        />
      </Flex>
      <Grid
        width={["100%"]}
        gridTemplateColumns={["1fr", null, null, "1fr 2fr"]}
        gap={5}
      >
        <VStack width="100%" gap={5}>
          <BigUpMasonry {...masonryData} />
        </VStack>
        <SpringScale delay={0} style={{ width: "100%" }}>
          <PerygonTabs tabs={tabsData} />
        </SpringScale>

        <SubmitScoreModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
          teamMembers={modalData.teamMembers}
          categories={modalData.categories}
        />
      </Grid>

      {/* Confetti Animation */}
      {showConfetti && <Confetti show={showConfetti} />}

      {/* Success modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          bg="pink.500"
          color="white"
          borderRadius="lg"
          textAlign="center"
          p={5}
        >
          <ModalHeader>Recognition sent!</ModalHeader>
          <ModalBody>Thank you for appreciating your colleagues.</ModalBody>
        </ModalContent>
      </Modal>

      <UserStatsModal
        isOpen={isUserStatsModalOpen}
        onClose={() => setIsUserStatsModalOpen(false)}
        userStats={userStats}
      />
    </>
  );
};
