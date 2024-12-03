import React from "react";
import { Box, Flex, useTheme } from "@chakra-ui/react";

interface HappinessDifferenceRendererProps {
  value: "Red" | "Amber" | "Green" | "Purple" | null;
}

const HappinessDifferenceRenderer: React.FC<
  HappinessDifferenceRendererProps
> = ({ value }) => {
  const theme = useTheme();

  // Define background colors for each value
  const backgroundColorMap: { [key: string]: string } = {
    Red: "red",
    Amber: theme.colors.yellow,
    Green: theme.colors.seduloGreen,
    Purple: "purple.500",
  };

  const backgroundColor = value ? backgroundColorMap[value] : "gray.500";

  return (
    <Flex alignItems="center" justifyContent="center" h="full" w="full">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        backgroundColor={backgroundColor || "gray.500"}
        color="white"
        fontWeight="bold"
        borderRadius="md"
        textAlign="center"
        h="80%"
        w="50%"
        p={2}
      >
        {value || "N/A"}
      </Box>
    </Flex>
  );
};

export default HappinessDifferenceRenderer;
