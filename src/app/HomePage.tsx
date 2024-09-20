"use client";

import { useTheme, VStack } from "@chakra-ui/react";
import { SplashScreen } from "@/components/SplashScreen/SplashScreen";
import { useState, useEffect } from "react";
import { NavBar, NavBarProps } from "./NavBar";
import { Tool } from "@/types/types";

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
    <VStack
      minH="100vh"
      width="100%"
      overflowX="hidden"
      flex={1}
      bgGradient={`linear(to-br, ${theme.colors.seduloRed}, ${theme.colors.perygonPink})`}
    >
      {isLoading ? (
        <SplashScreen />
      ) : (
        <>
          <NavBar {...navBarProps} />
        </>
      )}
    </VStack>
  );
}
