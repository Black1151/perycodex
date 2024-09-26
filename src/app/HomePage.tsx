"use client";

import { Box, useTheme, VStack } from "@chakra-ui/react";
import { SplashScreen } from "@/components/SplashScreen/SplashScreen";
import { useState, useEffect } from "react";
import { NavBar, NavBarProps } from "./NavBar";
import { Tool } from "@/types/types";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { Footer } from "@/components/layout/Footer";

interface HomePageProps {
  navBarProps: NavBarProps;
  toolsList: Tool[];
}

export default function Home({ navBarProps, toolsList }: HomePageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();

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
            {/* <Box width="10px" height="1000vw" bg="green"></Box> */}
            <Footer />
          </VStack>
        </>
      )}
    </PerygonContainer>
  );
}
