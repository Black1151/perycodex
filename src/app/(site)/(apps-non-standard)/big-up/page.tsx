"use client";

import { useState, useEffect } from "react";
import { Flex, Grid, VStack } from "@chakra-ui/react";
import { BigUpMasonry } from "./masonry/BigUpMasonry";
import { PerygonTabs } from "./tabs/PerygonTabs";
import { useRouter } from "next/navigation";
import { UserStatsModal } from "./UserStatsModal";
import { SpringScale } from "@/components/animations/SpringScale";
import useBigUpUserStats from "./hooks/useBigUpUserStats";
import { useRecognitionActions } from "./hooks/useRecognitionActions";
import { createTabsData } from "./lib/bigUpTabsData";
import { ConfettiWrapper } from "./components/ConfettiWrapper";
import RecognitionHeader from "./components/RecognitionHeader";
import useBigUpDashboard from "./hooks/useBigUpDashboard";
import { NewRecognitionModal } from "./modal/NewRecognitionModal";
import { RecognitionSuccessModal } from "./modal/RecognitionSuccessModal";
import SubmitScoreModal from "./modal/SubmitScoreModal";
import { RecognitionList } from "./tabs/OtherTabs/RecognitionCardList";
import { useUnread } from "@/components/contexts/UnreadRecognitionContext";

export default function BigUpPage() {
  const router = useRouter();

  const { dashboardData, fetchDashboardData, loading } = useBigUpDashboard();
  const { userStats, fetchUserStats } = useBigUpUserStats();

  const {
    showSuccessModal,
    setShowSuccessModal,
    showConfetti,
    setShowConfetti,
    handleSubmitRecognition,
  } = useRecognitionActions(fetchDashboardData);

  const { markAsRead } = useUnread();

  const [isUserStatsModalOpen, setIsUserStatsModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isNewRecognitionModalOpen, setIsNewRecognitionModalOpen] =
    useState(false);

  const {
    bigUpLeaderboard,
    bigUpWall,
    bigUpToMe,
    bigUpFromMe,
    totalBigUp,
    averageBigUpMonthly,
    totalCurrentMonthBigUp,
    yourBigUpStats,
    teamMembers,
    bigUpCategories,
    bigUpUnread,
  } = dashboardData;

  const handleProfilePicClick = async (uuid: string) => {
    await fetchUserStats(uuid);
    setIsUserStatsModalOpen(true);
  };

  const handleLeaderboardProfilePicClick = async (uuid: string) => {
    router.push(`/users/${uuid}`);
  };

  const tabsData = createTabsData({
    bigUpLeaderboard,
    bigUpWall,
    bigUpToMe,
    bigUpFromMe,
    handleLeaderboardProfilePicClick,
    handleProfilePicClick,
  });

  const unreadRecognitionModalData = (
    <RecognitionList
      gridTemplateColumns="1fr"
      items={bigUpUnread}
      onClickProfilePic={handleProfilePicClick}
    />
  );

  const masonryData = {
    items: [
      { title: "Company: Total", content: totalBigUp.toLocaleString() },
      {
        title: "Company: Monthly Avg",
        content: averageBigUpMonthly.toFixed(2),
      },
      {
        title: "Company: Current Month",
        content: totalCurrentMonthBigUp.toLocaleString(),
      },
      {
        title: "You: Total Given",
        content: yourBigUpStats?.bigUpGivenPoints.toLocaleString(),
      },
    ],
    userStats: yourBigUpStats,
  };

  const modalData = {
    teamMembers,
    categories: bigUpCategories,
  };

  useEffect(() => {
    if (bigUpUnread && bigUpUnread.length > 0) {
      setIsNewRecognitionModalOpen(true);
      setShowConfetti(true);
    }

    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, [bigUpUnread, setShowConfetti]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Flex
      w="100%"
      maxH="100%"
      gap={2}
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      backgroundImage="url('/big-up/big-up-app-bg.webp')"
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      pt={[74, null, null, null]}
      pb={[4, 51, null, null, null]}
      px={[2, null, null, 5]}
    >
      <Flex
        bg="perygonBlueTransparent"
        w="full"
        alignItems="center"
        borderRadius="lg"
        p={2}
        pr={6}
      >
        <RecognitionHeader
          headingText="Recognition Hub"
          onAddButtonClick={() => setIsSubmitModalOpen(true)}
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
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
          onSubmit={handleSubmitRecognition}
          teamMembers={modalData.teamMembers}
          categories={modalData.categories}
        />
      </Grid>

      <ConfettiWrapper show={showConfetti} />

      <RecognitionSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />

      <UserStatsModal
        isOpen={isUserStatsModalOpen}
        userStats={userStats}
        onClose={() => setIsUserStatsModalOpen(false)}
        handleProfilePicClick={handleLeaderboardProfilePicClick}
      />

      <NewRecognitionModal
        isOpen={isNewRecognitionModalOpen}
        onClose={async () => {
          setIsNewRecognitionModalOpen(false);
          await markAsRead();
        }}
        unreadRecognitionModalData={unreadRecognitionModalData}
      />
    </Flex>
  );
}
