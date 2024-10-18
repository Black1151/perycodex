"use client";

import { Flex, Grid, GridItem, HStack, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { Footer } from "@/components/layout/Footer";
import { NavBarProps, NavBar } from "../../NavBar";
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
  navBarProps: NavBarProps;
  toolData: Tool;
}

export default function HappinessScoreClientInner({
  navBarProps,
}: HappinessScoreClientInnerProps) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  }, []);

  const router = useRouter();

  return (
    <>
      <PerygonContainer>
        <NavBar {...navBarProps} />
        {isLoading ? (
          <HappinessScoreSplashScreen />
        ) : (
          <>
            <HStack justifyContent="space-between" mt={16} w="100%">
              <Text color="white" fontSize={["lg", "2xl"]} fontWeight="bold">
                Happiness Score
              </Text>
              <AddButton
                label="Create New"
                onClick={() => router.push("/test-happiness-score")}
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
                        ]}
                      />
                    </SpringScale>
                  </GridItem>
                  <GridItem>
                    <HappinessScoreMasonry />
                  </GridItem>
                  <GridItem>
                    <SpringScale delay={0.1} style={{ height: "100%" }}>
                      <Flex flex={1} flexDirection="column" w="100%" h="100%">
                        <Flex mb={4} width="100%" justifyContent="center">
                          <SectionHeader>Happiness by Group</SectionHeader>
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
          </>
        )}
      </PerygonContainer>
      <Footer />
    </>
  );
}
