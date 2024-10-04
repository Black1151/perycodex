"use client";

import { VStack } from "@chakra-ui/react";
import { SplashScreen } from "@/components/SplashScreen/SplashScreen";
import { useState, useEffect } from "react";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { Footer } from "@/components/layout/Footer";
import { NavBarProps, NavBar } from "../NavBar";
import { NavigationDrawer } from "../navigationDrawer";

interface HappinessScoreClientInnerProps {
  navBarProps: NavBarProps;
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
        <SplashScreen />
      ) : (
        <>
          <VStack minH="100vh">
            <NavBar {...navBarProps} />

            {/* Left Navigation Drawer with Chevron */}
            <NavigationDrawer drawerHeader="Left Navigation" placement="left">
              {/* Add left drawer content here */}
              Navigation Items
            </NavigationDrawer>

            {/* Right Navigation Drawer with Chevron */}
            <NavigationDrawer drawerHeader="Right Navigation" placement="right">
              {/* Add right drawer content here */}
              Navigation Items
            </NavigationDrawer>

            <Footer />
          </VStack>
        </>
      )}
    </PerygonContainer>
  );
}
