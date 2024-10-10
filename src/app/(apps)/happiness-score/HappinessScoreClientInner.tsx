"use client";

import { VStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { Footer } from "@/components/layout/Footer";
import { NavBarProps, NavBar } from "../../NavBar";
import { Tool } from "@/types/types";
import { HappinessScoreSplashScreen } from "./HappinessScoreSplashScreen";
import { NavigationDrawer } from "@/components/layout/navigationDrawer";

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

  return (
    <PerygonContainer>
      {isLoading ? (
        <HappinessScoreSplashScreen />
      ) : (
        <>
          <VStack minH="100vh">
            <NavBar {...navBarProps} />
            <VStack mt={10} flex={1} width="100%" bg="red">
              PAGE CONTENT HERE
            </VStack>
            <Footer />
          </VStack>
          <NavigationDrawer drawerHeader="Left Menu" placement="left" />
          <NavigationDrawer drawerHeader="Right Menu" placement="right" />
        </>
      )}
    </PerygonContainer>
  );
}
