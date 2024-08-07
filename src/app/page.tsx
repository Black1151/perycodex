"use client";

import {
  useTheme,
  VStack,
  Stack,
  SimpleGrid,
  GridItem,
} from "@chakra-ui/react";
import { ScoreForm } from "./ScoreForm";
import { Header } from "./Header";
import BarGraph from "@/components/graphs/BarGraph";
import { StatBox } from "@/components/Masonry/StatsMasonry/StatBox";
import { SpringScale } from "@/components/animations/SpringScale";

export default function Home() {
  const theme = useTheme();

  return (
    <VStack
      minH="100vh"
      width="100%"
      overflowX="hidden"
      flex={1}
      bgGradient={`linear(to-br, ${theme.colors.seduloRed}, ${theme.colors.perygonPink})`}
    >
      <Header />
      {/* <ScoreForm /> */}

      <Stack
        flexDirection={["column-reverse", null, null, "row"]}
        gap={5}
        width="100%"
        maxW={1200}
        p={6}
      >
        <SimpleGrid gap={5} columns={[2]}>
          <SpringScale delay={0}>
            <StatBox bgColor={theme.colors.red} data="22" title={"1-2"} />
          </SpringScale>
          <SpringScale delay={0.5}>
            <StatBox bgColor={theme.colors.yellow} data={"153"} title={"3-5"} />
          </SpringScale>
          <SpringScale delay={0.7}>
            <StatBox
              bgColor={theme.colors.lightGreen}
              data={"6"}
              title={"6-8"}
            />
          </SpringScale>
          <SpringScale delay={1.2}>
            <StatBox bgColor={theme.colors.green} data={"220"} title={"9-10"} />
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
        <SpringScale delay={0.1} style={{ width: "100%" }}>
          <BarGraph
            DataPoints={[
              { value: 9, title: "Leeds" },
              { value: 7, title: "Manchester" },
              { value: 2, title: "Birmingham" },
              { value: 7, title: "London" },
              { value: 10, title: "Edinburugh" },
              { value: 3, title: "Dublin" },
            ]}
          />
        </SpringScale>
      </Stack>
    </VStack>
  );
}
