"use client";

import { VStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";

import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { Footer } from "@/components/layout/Footer";
import { NavBarProps, NavBar } from "../../NavBar";
import { Tool } from "@/types/types";
import { HappinessScoreSplashScreen } from "./HappinessScoreSplashScreen";

interface HappinessScoreClientInnerProps {
  navBarProps: NavBarProps;
  toolData: Tool;
}

export default function HappinessScoreClientInner({
  navBarProps,
}: HappinessScoreClientInnerProps) {
  const [isLoading, setIsLoading] = useState(true);

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
            <Footer />
          </VStack>
        </>
      )}
    </PerygonContainer>
  );
}
