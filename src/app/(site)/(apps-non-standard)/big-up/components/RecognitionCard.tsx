import React from "react";
import { Box, BoxProps, Card, theme, useTheme } from "@chakra-ui/react";
import PerygonCard from "@/components/layout/PerygonCard";

interface CardProps extends BoxProps {
  children: React.ReactNode;
}

export const RecognitionCard: React.FC<CardProps> = ({ children, ...rest }) => {
  const theme = useTheme();
  return (
    <PerygonCard bg={theme.fringeCases.recognitionCard.elementBG} {...rest}>
      {children}
    </PerygonCard>
  );
};
