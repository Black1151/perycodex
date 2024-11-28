import React, { useRef, useEffect, useState, memo } from "react";
import {
  Box,
  HStack,
  Text,
  useBreakpointValue,
  Flex,
  VStack,
  Tooltip,
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

    const yAxisTicks = Array.from({ length: 11 }, (_, i) => i);

    const leftPadding = useBreakpointValue({ base: 20, md: 40 }) ?? 40;
    const rightPadding = useBreakpointValue({ base: 20, md: 40 }) ?? 40;
    const topPadding = useBreakpointValue({ base: 40, md: 80 }) ?? 80;
    const bottomPadding = useBreakpointValue({ base: 140, md: 140 }) ?? 80;
    const xAxisPadding = useBreakpointValue({ base: 20, md: 50 }) ?? 50;
    const imageSize = useBreakpointValue({ base: 20, md: 30 }) ?? 30;
    const strokeWidth = useBreakpointValue({ base: 2, md: 3 }) ?? 3;
    const fontSize = useBreakpointValue({ base: "xs", md: "sm" });

    const defaultGraphHeight =
      useBreakpointValue({ base: 400, md: 400 }) ?? 300;
    const graphHeight = graphHeightProp ?? defaultGraphHeight;
    const totalHeight = graphHeight + topPadding + bottomPadding;

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
            {yAxisTicks.map((tick, index) => (
              <motion.div
                key={tick}
                custom={index}
                style={{ width: "100%" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <HStack
                  width="100%"
                  position="absolute"
                  style={{ top: `${mapValueToY(tick)}px` }}
                >
                  <Text
                    fontSize={fontSize}
                    color="gray.500"
                    position="absolute"
                    top="50%"
                    transform="translateY(-50%)"
                    width={`${leftPadding}px`}
                    textAlign="center"
                  >
                    {tick}
                  </Text>
                  <Box
                    position="absolute"
                    left={`${leftPadding}px`}
                    right={`${rightPadding}px`}
                    height="1px"
                    bg="gray.300"
                  />
                </HStack>
              </motion.div>
            ))}
          </VStack>

          {/* X-axis labels */}
          {DataPoints.map((point, index) => (
            <Text
              key={index}
              fontSize={fontSize}
              color="gray.500"
              position="absolute"
              left={`${mapIndexToX(index)}px`}
              bottom={`${bottomPadding - 70}px`}
              transform="translateX(-50%) rotate(90deg)"
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
            <defs>
              {DataPoints.slice(0, -1).map((point, index) => {
                const nextPoint = DataPoints[index + 1];
                if (point.value === 0 && nextPoint.value === 0) {
                  return null;
                }

                const color1 = getHappinessColor(point.value);
                const color2 = getHappinessColor(nextPoint.value);

                if (color1 === color2) {
                  return null;
                }

                return (
                  <linearGradient
                    key={index}
                    id={`gradient-${index}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor={color1} />
                    <stop offset="100%" stopColor={color2} />
                  </linearGradient>
                );
              })}
            </defs>
            {DataPoints.slice(0, -1).map((point, index) => {
              const nextPoint = DataPoints[index + 1];
              if (point.value === 0 && nextPoint.value === 0) {
                return null;
              }
              const x1 = mapIndexToX(index);
              const y1 = mapValueToY(point.value);
              const x2 = mapIndexToX(index + 1);
              const y2 = mapValueToY(nextPoint.value);

              const color1 = getHappinessColor(point.value);
              const color2 = getHappinessColor(nextPoint.value);

              const gradientId = `gradient-${index}`;

              const strokeColor =
                color1 === color2 ? color1 : `url(#${gradientId})`;

              return (
                <motion.path
                  key={index}
                  d={`M ${x1} ${y1} L ${x2} ${y2}`}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
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

          {/* Data point images */}
          {DataPoints.map(
            (point, index) =>
              point.value !== 0 && (
                <Tooltip
                  key={index}
                  label={`Score: ${point.value.toFixed(2)} on: ${point.title}`}
                  placement="top"
                  bg={perygonTheme.colors.perygonPink}
                  color="white"
                  borderRadius="md"
                >
                  <motion.img
                    src={getFaceImage(point.value)}
                    alt={`Face for score ${Math.round(point.value)}`}
                    style={{
                      position: "absolute",
                      left: `${mapIndexToX(index) - imageSize / 2}px`,
                      top: `${mapValueToY(point.value) - imageSize / 2}px`,
                      width: imageSize,
                      height: imageSize,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.2, duration: 0.3 }}
                  />
                </Tooltip>
              )
          )}
        </Box>
      </Flex>
    );
  }
);

LineGraph.displayName = "LineGraph";

export default LineGraph;
