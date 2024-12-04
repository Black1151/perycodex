import React, { useState } from "react";
import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useTheme,
} from "@chakra-ui/react";

import { AgChartOptions } from "ag-charts-enterprise";

import { AgCharts } from "ag-charts-react";

interface HappinessDifferenceRendererProps {
  value: "Red" | "Amber" | "Green" | "Purple" | null;
  node: {
    data: {
      userId: string;
      scoresArray?: { score: number }[];
      [key: string]: any;
    };
  };
}

const HappinessDifferenceRenderer: React.FC<
  HappinessDifferenceRendererProps
> = ({ value, node }) => {
  const theme = useTheme();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const userId = node.data.userId;
  const validScoresArray = (() => {
    try {
      return Array.isArray(node.data.scoresArray)
        ? node.data.scoresArray
        : JSON.parse(node.data.scoresArray || "[]");
    } catch (error) {
      console.error("Error parsing scoresArray:", error);
      return [];
    }
  })();

  const [options, setOptions] = useState<AgChartOptions>({
    title: {
      text: "Score Histogram",
    },
    data: validScoresArray,
    series: [
      {
        type: "histogram",
        xKey: "score",
        xName: "Scores",
        bins: Array.from({ length: 10 }, (_, i) => [i, i + 1]),
      },
    ],
    axes: [
      { type: "number", position: "bottom", title: { text: "Score Rating" } },
      { type: "number", position: "left", title: { text: "Frequency" } },
    ],
    legend: { enabled: false },
  });

  // Define background colors for each value
  const backgroundColorMap: { [key: string]: string } = {
    Red: "red",
    Amber: theme.colors.yellow,
    Green: theme.colors.seduloGreen,
    Purple: theme.colors.purple[500],
  };

  const backgroundColor = value ? backgroundColorMap[value] : "gray.500";

  return (
    <>
      {/* Main Cell Renderer */}
      <Flex
        alignItems="center"
        justifyContent="center"
        h="full"
        w="full"
        onClick={onOpen}
        cursor="pointer"
      >
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

      {/* Modal Component */}
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="black">
            {`Happiness Details for User ID: ${userId}`}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" w="100%" h="500px">
              <Text
                mb={4}
                fontSize="xl"
                fontWeight="bold"
                color={backgroundColor}
              >
                Status: {value}
              </Text>
              <AgCharts options={options as any} />
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default HappinessDifferenceRenderer;
