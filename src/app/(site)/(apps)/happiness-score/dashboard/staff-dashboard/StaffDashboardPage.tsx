"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button, Flex, Grid, GridItem } from "@chakra-ui/react";
import { SpringScale } from "@/components/animations/SpringScale";
import { Add } from "@mui/icons-material";
import SpeechBubble from "@/app/(site)/(apps)/happiness-score/SpeechBubble";
import { SectionHeader } from "@/components/sectionHeader/SectionHeader";
import LineGraph from "@/components/graphs/LineGraph";

export default function StaffDashboardPage() {
  const router = useRouter();

  const getHistoricalHappinessForLineGraph = () => {
    // dummy data
    return [
      { value: 3, title: "2024-01-01" },
      { value: 5, title: "2024-01-02" },
      { value: 9, title: "2024-01-03" },
      { value: 7, title: "2024-01-04" },
      { value: 6, title: "2024-01-05" },
      { value: 8, title: "2024-01-06" },
      { value: 10, title: "2024-01-07" },
    ];
  };

  const getHistoricalHappinessForLineGraphTEST = async () => {
    const response = await fetch(
      "/api/happiness-graphs/getScoreHistoryLineGraph",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const data = await response.json();
    return data.resource;
  };

  useEffect(() => {
    getHistoricalHappinessForLineGraphTEST();
  }, []);

  const getSpeechBubbleData = () => {
    return {
      score: 5,
      text: "Test data!",
      change: 1,
    };
  };

  const speechBubbleData = getSpeechBubbleData();
  const lineGraphData = getHistoricalHappinessForLineGraph();

  const handleStartWorkflow = () => {
    router.push("/happiness-score/workflow/141");
  };

  return (
    <Flex
      flex={1}
      h="100%"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Flex w="100%" justifyContent="flex-end">
        <SpringScale delay={0.6} style={{ height: "100%" }}>
          <Button
            variant="green"
            onClick={handleStartWorkflow}
            display="flex"
            alignItems="center"
            gap={[0, 0, 2]}
            lineHeight={0}
          >
            <Add />
            Create New
          </Button>
        </SpringScale>
      </Flex>
      <Grid
        templateColumns={["1fr", "1fr 1fr"]}
        gap={6}
        width="100%"
        minH="80vh"
      >
        <GridItem>
          <SpringScale delay={0.3} style={{ height: "100%" }}>
            <SpeechBubble {...speechBubbleData} />
          </SpringScale>
        </GridItem>
        <GridItem>
          <SpringScale delay={0.5} style={{ height: "100%" }}>
            <Flex pb={4} flex={1} width="100%" justifyContent="center">
              <SectionHeader>Happiness History</SectionHeader>
            </Flex>
            <LineGraph DataPoints={lineGraphData} />
          </SpringScale>
        </GridItem>
      </Grid>
    </Flex>
  );
}
