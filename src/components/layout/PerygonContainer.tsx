"use client";

import { useTheme, VStack } from "@chakra-ui/react";
import { ReactNode } from "react";

interface PerygonContatinerProps {
  children: ReactNode;
}

export const PerygonContainer: React.FC<PerygonContatinerProps> = ({
  children,
}) => {
  const theme = useTheme();

  return (
    <VStack
      minH="100svh"
      width="100%"
      flex={1}
      bgGradient={theme.gradients.primaryGradient}
    >
      {children}
    </VStack>
  );
};
