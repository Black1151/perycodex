"use client";

import { Flex, Grid, GridItem, Heading, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Tool } from "@/types/types";
import { HappinessScoreSplashScreen } from "./HappinessScoreSplashScreen";
import { HappinessScoreMasonry } from "./HappinessScoreMasonry";
import BarGraph from "@/components/graphs/BarGraph";
import { SpringScale } from "@/components/animations/SpringScale";
import { SectionHeader } from "@/components/sectionHeader/SectionHeader";
import SpeechBubble from "./SpeechBubble";
import LineGraph from "@/components/graphs/LineGraph";
import AddButton from "@/components/Buttons/AddButton";
import { useRouter } from "next/navigation";

interface HappinessScoreClientInnerProps {
  toolData: Tool;
  toolId: string;
  workflowId: string;
}

export default function HappinessScoreClientInner({
  toolData,
  toolId,
  workflowId,
}: HappinessScoreClientInnerProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  }, []);

  const router = useRouter();

  return (
    <>
      {isLoading ? (
        <HappinessScoreSplashScreen />
      ) : (
        <Flex
          flex={1}
          width="100%"
          flexDirection="column"
          pt={8}
          pb={16}
          px={[4, 8]}
        >
          <HStack justifyContent="space-between" mt={12} w="100%">
            <Heading
              as={"h1"}
              fontWeight={100}
              color="white"
              size={["lg", "xl"]}
              fontFamily={"Bonfire"}
            >
              Happiness Scores
            </Heading>
            <AddButton
              label="Create New"
              toolId={toolId}
              workflowId={workflowId}
              redirectUrl={"/happiness-score"}
            />
          </HStack>
          <Grid
            templateAreas={`"main"`}
            gridTemplateRows={"1fr"}
            minH="100vh"
            w="100%"
          >
            <GridItem area={"main"} mt={10}>
              <Grid
                templateColumns={["1fr", null, "1fr 2fr"]}
                gap={[12, null, 16]}
              >
                <GridItem>
                  <SpringScale delay={0.2}>
                    <SpeechBubble
                      score={8.23}
                      text="Great!"
                      change={0.57}
                      fill="white"
                      positiveChange={true}
                    />
                  </SpringScale>
                </GridItem>
                <GridItem>
                  <SpringScale delay={0.3} style={{ height: "100%" }}>
                    <Flex width="100%" justifyContent="center" mb={4}>
                      <SectionHeader>Happiness Trend</SectionHeader>
                    </Flex>
                    <LineGraph
                      DataPoints={[
                        { value: 6.2, title: "Jan" },
                        { value: 2.7, title: "Feb" },
                        { value: 5.5, title: "Mar" },
                        { value: 8.1, title: "Apr" },
                        { value: 1.2, title: "May" },
                        { value: 9.3, title: "Jun" },
                        { value: 9.1, title: "Jun" },
                        { value: 3.5, title: "Jun" },
                      ]}
                    />
                  </SpringScale>
                </GridItem>
                <GridItem>
                  <HappinessScoreMasonry
                    masonryValues={["50", "23", "46", "19"]}
                  />
                </GridItem>
                <GridItem>
                  <SpringScale delay={0.1} style={{ height: "100%" }}>
                    <Flex flex={1} flexDirection="column" w="100%" h="100%">
                      <Flex mb={4} width="100%" justifyContent="center">
                        <SectionHeader>Happiness by Team</SectionHeader>
                      </Flex>
                      <BarGraph
                        DataPoints={[
                          { value: 1, title: "Leeds" },
                          { value: 2, title: "Manchester" },
                          { value: 3, title: "Birmingham" },
                          { value: 4, title: "London" },
                          { value: 5, title: "Edinburgh" },
                          { value: 6, title: "Dublin" },
                          { value: 7, title: "Bristol" },
                          { value: 8, title: "Cardiff" },
                          { value: 9, title: "Glasgow" },
                          { value: 10, title: "Aberdeen" },
                        ]}
                      />
                    </Flex>
                  </SpringScale>
                </GridItem>
              </Grid>
            </GridItem>
          </Grid>
        </Flex>
      )}
    </>
  );
}
