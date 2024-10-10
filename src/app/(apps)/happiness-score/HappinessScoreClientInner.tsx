"use client";

import {
  Box,
  Flex,
  GridItem,
  SimpleGrid,
  Stack,
  useTheme,
  VStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { Footer } from "@/components/layout/Footer";
import { NavBarProps, NavBar } from "../../NavBar";
import { Tool } from "@/types/types";
import { HappinessScoreSplashScreen } from "./HappinessScoreSplashScreen";
import { NavigationDrawer } from "@/components/layout/navigationDrawer";
import { SpringScale } from "@/components/animations/SpringScale";
import BarGraph from "@/components/graphs/BarGraph";
import { StatBox } from "@/components/Masonry/StatsMasonry/StatBox";
import { SectionHeader } from "@/components/sectionHeader/SectionHeader";

interface HappinessScoreClientInnerProps {
  navBarProps: NavBarProps;
  toolData: Tool;
}

export default function HappinessScoreClientInner({
  navBarProps,
}: HappinessScoreClientInnerProps) {
  const [isLoading, setIsLoading] = useState(false);

  const theme = useTheme();

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  }, []);

  return (
    <PerygonContainer>
      {isLoading ? (
        <HappinessScoreSplashScreen />
      ) : (
        <>
          <VStack minH="100vh">
            <NavBar {...navBarProps} />
            <VStack mt={10} flex={1} width="100%">
              <Stack
                flexDirection={["column-reverse", null, null, "row"]}
                gap={5}
                // width="100%"
                // maxW={1200}
                p={6}
              >
                <VStack w="100%" flex={1}>
                  <SpringScale delay={0.2}>
                    <Box mb={2}>
                      <SectionHeader>Happiness by Individuals</SectionHeader>
                    </Box>
                  </SpringScale>
                  <SimpleGrid gap={5} columns={[2]} flex={1} w="100%">
                    <SpringScale delay={0}>
                      <StatBox
                        bgColor={"red"}
                        data="22"
                        title={"1-2"}
                        titleImage="/faces/happiness_score_2.png"
                      />
                    </SpringScale>
                    <SpringScale delay={0.5}>
                      <StatBox
                        bgColor={theme.colors.yellow}
                        data={"153"}
                        title={"3-5"}
                        titleImage="/faces/happiness_score_6.png"
                      />
                      p
                    </SpringScale>
                    <SpringScale delay={0.7}>
                      <StatBox
                        bgColor={theme.colors.lightGreen}
                        data={"6"}
                        title={"6-8"}
                        titleImage="/faces/happiness_score_8.png"
                      />
                    </SpringScale>
                    <SpringScale delay={1.2}>
                      <StatBox
                        bgColor={theme.colors.green}
                        data={"220"}
                        title={"9-10"}
                        titleImage="/faces/happiness_score_9.png"
                      />
                    </SpringScale>
                    <GridItem colSpan={2}>
                      <SpringScale delay={0.3}>
                        <StatBox
                          bgColor="lightGray"
                          data={"7"}
                          title={"Did not participate"}
                          counterColor={"lightGray"}
                        />
                      </SpringScale>
                    </GridItem>
                  </SimpleGrid>
                </VStack>
                <SpringScale delay={0.1} style={{ flex: 2 }}>
                  <Flex mb={4} width="100%" justifyContent="center">
                    <SectionHeader>Happiness by Group</SectionHeader>
                  </Flex>
                  <BarGraph
                    DataPoints={[
                      { value: 9, title: "Leeds" },
                      { value: 7, title: "Manchester" },
                      { value: 2, title: "Birmingham" },
                      { value: 7, title: "London" },
                      { value: 10, title: "Edinburgh" },
                      { value: 3, title: "Dublin" },
                    ]}
                  />
                </SpringScale>
              </Stack>
            </VStack>
            <Footer />
          </VStack>
          {/* <NavigationDrawer drawerHeader="Left Menu" placement="left" />
          <NavigationDrawer drawerHeader="Right Menu" placement="right" /> */}
        </>
      )}
    </PerygonContainer>
  );
}
