"use client";

import { VStack } from "@chakra-ui/react";
import { SplashScreen } from "@/components/SplashScreen/SplashScreen";
import { useState, useEffect } from "react";

import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { Footer } from "@/components/layout/Footer";
import { NavBarProps, NavBar } from "../NavBar";

interface HappinessScoreClientInnerProps {
  navBarProps: NavBarProps;
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
        <SplashScreen />
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
