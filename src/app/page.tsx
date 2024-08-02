"use client";

import { Heading, useTheme, VStack } from "@chakra-ui/react";
import { ScoreForm } from "./ScoreForm";
import { Header } from "./Header";
import BarGraph from "@/components/graphs/BarGraph";

export default function Home() {
  const theme = useTheme();

  return (
    <VStack
      minH="100vh"
      width="100vw"
      overflowX="hidden"
      flex={1}
      bgGradient={`linear(to-br, ${theme.colors.seduloRed}, ${theme.colors.perygonPink})`}
    >
      <Header />
      <ScoreForm />
      <BarGraph
        DataPoints={[
          { value: 9, title: "Leeds" },
          { value: 7, title: "Manchester" },
          { value: 2, title: "Birmingham" },
          { value: 6, title: "London" },
        ]}
      />
    </VStack>
  );
}
