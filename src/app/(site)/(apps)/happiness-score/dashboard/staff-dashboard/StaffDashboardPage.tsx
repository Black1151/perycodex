"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Flex, Grid, GridItem } from "@chakra-ui/react";
import { SpringScale } from "@/components/animations/SpringScale";
import SpeechBubble from "@/app/(site)/(apps)/happiness-score/SpeechBubble";
import { SectionHeader } from "@/components/sectionHeader/SectionHeader";
import LineGraph from "@/components/graphs/LineGraph";

export default function StaffDashboardPage() {
  const router = useRouter();

  const [happinessData, setHappinessData] = useState<any>(null);
  const [lineGraphData, setLineGraphData] = useState<any[]>([]);

  const getHappinessData = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const toolId = urlParams.get("toolId");
    const wfId = urlParams.get("wfId");
    const businessProcessId = 1;

    const payload = {
      toolId,
      workflowId: wfId,
      businessProcessId,
    };

    const response = await fetch(
      "/api/happiness-graphs/getStaffDashboardData",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await response.json();
    setHappinessData(data.resource);

    // Process historic records for line graph
    const historicRecords = JSON.parse(data.resource.historicrecords);
    setLineGraphData(
      historicRecords.map((record: any) => ({
        value: parseFloat(record.value),
        title: record.title,
      })),
    );
  };

  useEffect(() => {
    getHappinessData();
  }, []);

  const getSpeechBubbleData = () => {
    if (!happinessData || lineGraphData.length === 0) {
      return { score: 0, text: "Loading...", change: 0 };
    }

    const score = parseFloat(happinessData.averagehappiness);
    const change =
      lineGraphData.length > 1
        ? lineGraphData[lineGraphData.length - 1].value -
          lineGraphData[lineGraphData.length - 2].value
        : 0;

    return {
      score,
      change,
    };
  };

  const speechBubbleData = getSpeechBubbleData();
  const positiveChange = speechBubbleData.change > 0;

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
      <Grid
        templateColumns={["1fr", "1fr 1fr"]}
        gap={6}
        width="100%"
        minH="80vh"
      >
        <GridItem>
          <SpringScale delay={0.3} style={{ height: "100%" }}>
            <SpeechBubble
              {...speechBubbleData}
              positiveChange={positiveChange}
            />
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
