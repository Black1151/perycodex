import React from "react";
import { Box, BoxProps } from "@chakra-ui/react";

interface CardProps extends BoxProps {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, ...rest }) => {
  return (
    <Box borderRadius="lg" bg="white" p={4} boxShadow="md" {...rest}>
      {children}
    </Box>
  );
};

export default Card;
