"use client";

import { VStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { Footer } from "@/components/layout/Footer";
import { NavBarProps, NavBar } from "../../NavBar";
import { Tool } from "@/types/types";

interface ClientSatisfactionClientInnerProps {
  navBarProps: NavBarProps;
  toolData: Tool;
}

export default function ClientSatisfactionClientInner({
  navBarProps,
}: ClientSatisfactionClientInnerProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 6000);
  }, []);

  return (
    <PerygonContainer>
      <>
        <VStack minH="100vh">
          <NavBar {...navBarProps} />
          <Footer />
        </VStack>
      </>
    </PerygonContainer>
  );
}
