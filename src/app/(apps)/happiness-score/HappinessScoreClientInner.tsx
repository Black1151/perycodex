"use client";

import { VStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { Footer } from "@/components/layout/Footer";
import { NavBarProps, NavBar } from "../../NavBar";
import { Tool } from "@/types/types";
import { HappinessScoreSplashScreen } from "./HappinessScoreSplashScreen";
import { LeftHandNavigationDrawer } from "@/components/layout/LeftHandNavigationDrawer";
import { RightHandNavigationDrawer } from "@/components/layout/RightHandNavigationDrawer";

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
            <VStack mt={10} flex={1} width="100%" bg="red"></VStack>
            <Footer />
          </VStack>
        </>
      )}
    </PerygonContainer>
  );
}
