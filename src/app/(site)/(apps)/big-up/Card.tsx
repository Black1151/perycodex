import React from "react";
import { Box } from "@chakra-ui/react";

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box borderRadius="lg" bg="white" p={4} boxShadow="md">
      {children}
    </Box>
  );
};

export default Card;
