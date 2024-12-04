import React, { useEffect, useState } from "react";
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
  VStack,
  Image,
  useTheme,
  useBreakpointValue,
  Avatar,
} from "@chakra-ui/react";

import {
  AgBarSeriesItemStylerParams,
  AgChartOptions,
} from "ag-charts-enterprise";

import { AgCharts } from "ag-charts-react";
import useColor from "@/hooks/useColor";
import { SectionHeader } from "@/components/sectionHeader/SectionHeader";
import { perygonTheme } from "@/theme/theme";
import { useRouter } from "next/navigation";

interface HappinessDifferenceRendererProps {
  node: {
    data: {
      userId: string;
      fullName: string;
      userUniqueId: string;
      userImageUrl?: string;
      currentRagStatus?:
        | "Red"
        | "Amber"
        | "Green"
        | "Purple"
        | "Gray"
        | "N/A"
        | null;
      scoreDistribution?: { score: number; count: number }[];
      [key: string]: any;
    };
  };
}

const HappinessDifferenceRenderer: React.FC<
  HappinessDifferenceRendererProps
> = ({ node }) => {
  const theme = useTheme();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fullName = node.data.fullName;
  const userImageUrl = node.data.userImageUrl;
  const { getColor } = useColor();
  const router = useRouter();
  const value = node.data.currentRagStatus;
  const isMobile = useBreakpointValue({ base: true, sm: false });

  // Parse the scores array safely
  const validScoresArray = (() => {
    try {
      return Array.isArray(node.data.scoreDistribution)
        ? node.data.scoreDistribution
        : JSON.parse(node.data.scoreDistribution || "[]");
    } catch (error) {
      return [];
    }
  })();

  const [options, setOptions] = useState<AgChartOptions>({
    data: validScoresArray,
    padding: {
      top: 20,
      left: 20,
      right: 20,
      bottom: 20,
    },
    series: [
      {
        type: "bar",
        xKey: "score",
        yKey: "count",
        xName: "Score",
        yName: "Count",
        cornerRadius: 10,
        shadow: {
          enabled: true,
          color: "#191919",
          xOffset: 1,
          yOffset: 1,
          blur: 4,
        },
        itemStyler: (params: AgBarSeriesItemStylerParams<any>) => {
          const { datum, xKey } = params;
          const score = parseInt(datum[xKey], 10); // Retrieve the score value
          return { fill: getColor(score) }; // Color based on score
        },
      },
    ],
    axes: [
      {
        type: "number",
        position: "bottom",
        label: {
          fontSize: 12,
          fontFamily: "Metropolis",
          color: theme.colors.perygonPink,
        },
        gridLine: {
          width: 0,
        },
      },
      {
        type: "number",
        position: "left",
        label: {
          fontSize: 12,
          fontFamily: "Metropolis",
          color: theme.colors.perygonPink,
        },
      },
    ],
    legend: {
      enabled: false,
    },
    zoom: {
      enabled: false,
    },
    navigator: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
    },
  });

  const backgroundColorMap: { [key: string]: string } = {
    Red: "red",
    Amber: theme.colors.yellow,
    Green: theme.colors.seduloGreen,
    Purple: theme.colors.purple[500],
    Gray: "gray",
  };

  const backgroundColorText: { [key: string]: string } = {
    Purple: "A lot higher than their average happiness",
    Green: "Slightly above their average happiness",
    Amber: "Slightly lower than their average happiness",
    Red: "A lot lower than their average happiness",
    Gray: "Has not submitted a score in the last month",
  };

  const statusText =
    value && backgroundColorText[value]
      ? backgroundColorText[value]
      : "Not enough submissions"; // Fallback for undefined statuses

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
          backgroundColor={backgroundColor}
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
        <ModalContent
          bgGradient={perygonTheme.gradients.perygonBackground}
          pb={3}
        >
          <ModalHeader color="white" fontWeight="bold">
            Happiness Histogram
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody>
            <Flex direction={["column"]} alignItems="flex-start" gap={6}>
              {/* User Image Section */}
              <Flex
                w={"full"}
                cursor={"pointer"}
                justifyContent={"flex-start"}
                alignItems={"center"}
                gap={4}
                onClick={() => router.push(`/users/${node.data.userUniqueId}`)}
              >
                <Avatar
                  src={userImageUrl}
                  name={fullName}
                  borderRadius="full"
                  boxSize={["60px", "120px"]}
                  objectFit="cover"
                  boxShadow="lg"
                />
                <Flex direction={"column"} gap={2}>
                  <Text
                    fontSize={["2xl", "3xl"]}
                    fontWeight="bold"
                    color="white"
                  >
                    {fullName}
                  </Text>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    backgroundColor={backgroundColor}
                    color="white"
                    fontSize={["sm", "2xl"]}
                    fontWeight="bold"
                    borderRadius="md"
                    textAlign="center"
                    p={1}
                  >
                    <Text fontWeight="bold">Status: {value ?? "N/A"}</Text>
                  </Box>
                </Flex>
              </Flex>

              <Text color={"white"} fontSize={"xs"}>
                {statusText}
              </Text>

              {/* User Info and Chart */}
              <Flex flex="1" direction="column" gap={4} width={"full"}>
                <Box
                  minW={["100%", "100%", "48%"]}
                  flex={1}
                  textAlign="center"
                  borderRadius="lg"
                >
                  <Flex width="100%" justifyContent="flex-start" mb={2}>
                    <SectionHeader>Previous 12 month submissions</SectionHeader>
                  </Flex>
                  <Box borderRadius={"2xl"} shadow={"xl"} overflow={"hidden"}>
                    <AgCharts options={options as any} />
                  </Box>
                </Box>
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default HappinessDifferenceRenderer;
