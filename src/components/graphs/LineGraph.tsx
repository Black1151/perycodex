import React, { memo, useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  HStack,
  Text,
  Tooltip,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { perygonTheme } from "@/theme/theme";

interface DataPoint {
  value: number;
  title: string;
}

interface LineGraphProps {
  DataPoints: DataPoint[];
  graphHeight?: number;
}

const LineGraph: React.FC<LineGraphProps> = memo(
  ({ DataPoints = [], graphHeight: graphHeightProp }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [animationKey, setAnimationKey] = useState(0);

    useEffect(() => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }

      const handleResize = () => {
        if (containerRef.current) {
          setContainerWidth(containerRef.current.offsetWidth);
        }
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
      setAnimationKey((prevKey) => prevKey + 1);
    }, [DataPoints]);

    const maxValue = Math.max(
      Math.ceil(Math.max(...DataPoints.map((point) => point.value), 0)),
      10
    );

    const leftPadding = useBreakpointValue({ base: 40, md: 40 }) ?? 40;
    const rightPadding = useBreakpointValue({ base: 20, md: 40 }) ?? 40;
    const topPadding = useBreakpointValue({ base: 40, md: 40 }) ?? 80;
    const bottomPadding = useBreakpointValue({ base: 75, md: 100 }) ?? 80;
    const xAxisPadding = useBreakpointValue({ base: 40, md: 50 }) ?? 50;
    const defaultGraphHeight =
      useBreakpointValue({ base: 300, md: 500 }) ?? 300;
    const graphHeight = graphHeightProp ?? defaultGraphHeight;
    const totalHeight = graphHeight + topPadding + bottomPadding;

    if (DataPoints.length <= 1) {
      return (
        <Flex
          height={`${totalHeight}px`}
          position="relative"
          width="100%"
          flex={1}
          alignItems="center"
          justifyContent="center"
          bg="white"
          borderRadius={{ base: "8px", md: "16px" }}
          overflow="hidden"
          boxShadow="lg"
        >
          <Text
            fontSize="lg"
            fontWeight="bold"
            color={perygonTheme.colors.perygonPink}
          >
            No history to show
          </Text>
        </Flex>
      );
    }

    const mapIndexToX = (index: number) => {
      return (
        leftPadding +
        xAxisPadding +
        (index *
          (containerWidth - leftPadding - rightPadding - 2 * xAxisPadding)) /
          (DataPoints.length - 1)
      );
    };

    const mapValueToY = (value: number) => {
      return topPadding + ((maxValue - value) / maxValue) * graphHeight;
    };

    const getFaceImage = (value: number) => {
      const roundedValue = Math.round(value);
      return `/faces/happiness_score_${roundedValue}.png`;
    };

    const getHappinessColor = (value: number) => {
      const roundedValue = Math.round(value);
      return perygonTheme.colors.happinessScale[
        roundedValue as keyof typeof perygonTheme.colors.happinessScale
      ];
    };

    return (
      <Flex
        height={`${totalHeight}px`}
        position="relative"
        width="100%"
        flex={1}
      >
        <Box
          ref={containerRef}
          key={animationKey}
          width="100%"
          height={`${totalHeight}px`}
          position="relative"
          bg="white"
          borderRadius={{ base: "8px", md: "16px" }}
          overflow="hidden"
          boxShadow="lg"
          pt={10}
        >
          {/* Y-axis */}
          <VStack
            as={motion.div}
            initial="hidden"
            animate="visible"
            height={`${totalHeight}px`}
            justifyContent="space-between"
            width="100%"
            position="absolute"
            left="0"
            top="0"
          >
            {/* Y-axis rendering */}
          </VStack>

          {/* X-axis labels */}
          {DataPoints.map((point, index) => (
            <Text
              key={index}
              fontSize="sm"
              color={perygonTheme.colors.perygonPink}
              position="absolute"
              left={`${mapIndexToX(index)}px`}
              bottom={`${bottomPadding - 50}px`}
              transform="translateX(-90%) rotate(-45deg)"
              whiteSpace="nowrap"
            >
              {point.title}
            </Text>
          ))}

          {/* Line with gradient */}
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${containerWidth} ${totalHeight}`}
            preserveAspectRatio="none"
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            {DataPoints.slice(0, -1).map((point, index) => {
              const nextPoint = DataPoints[index + 1];
              if (point.value === 0 && nextPoint.value === 0) {
                return null;
              }
              const x1 = mapIndexToX(index);
              const y1 = mapValueToY(point.value);
              const x2 = mapIndexToX(index + 1);
              const y2 = mapValueToY(nextPoint.value);

              return (
                <motion.path
                  key={index}
                  d={`M ${x1} ${y1} L ${x2} ${y2}`}
                  stroke={getHappinessColor(point.value)}
                  strokeWidth={3}
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                    delay: index * 0.2,
                  }}
                />
              );
            })}
          </svg>
        </Box>
      </Flex>
    );
  }
);

LineGraph.displayName = "LineGraph";

export default LineGraph;
