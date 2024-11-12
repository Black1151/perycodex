import React, { useRef, useEffect } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { perygonTheme } from "@/theme/theme";

interface DataPoint {
  value: number;
  title: string;
}

interface LineGraphProps {
  DataPoints: DataPoint[];
}

const LineGraph: React.FC<LineGraphProps> = ({ DataPoints = [] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(0);

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

  const maxValue = Math.max(...DataPoints.map((point) => point.value), 0);

  // Responsive paddings and sizes
  const leftPadding = useBreakpointValue({ base: 20, md: 40 }) ?? 40;
  const rightPadding = useBreakpointValue({ base: 20, md: 40 }) ?? 40;
  const topPadding = useBreakpointValue({ base: 40, md: 80 }) ?? 80;
  const bottomPadding = useBreakpointValue({ base: 40, md: 80 }) ?? 80;
  const xAxisPadding = useBreakpointValue({ base: 20, md: 50 }) ?? 50;
  const imageSize = useBreakpointValue({ base: 20, md: 30 }) ?? 30;
  const strokeWidth = useBreakpointValue({ base: 2, md: 3 }) ?? 3;
  const fontSize = useBreakpointValue({ base: "xs", md: "sm" });

  const graphWidth =
    containerWidth - leftPadding - rightPadding - 2 * xAxisPadding;
  const graphHeight = useBreakpointValue({ base: 200, md: 400 }) ?? 300;
  const totalHeight = graphHeight + topPadding + bottomPadding;

  const yAxisTicks = Array.from(
    { length: Math.ceil(maxValue) + 1 },
    (_, i) => i,
  );

  const mapIndexToX = (index: number) => {
    return (
      leftPadding +
      xAxisPadding +
      (index * graphWidth) / (DataPoints.length - 1)
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
    <Box height={`${totalHeight}px`} position="relative">
      <Box
        ref={containerRef}
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
            <motion.div key={tick} custom={index} style={{ width: "100%" }}>
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
            bottom={`${bottomPadding - 20}px`}
            transform="translateX(-50%)"
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
            {DataPoints.slice(0, -1).map((point, index) => (
              <linearGradient
                key={index}
                id={`gradient-${index}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor={getHappinessColor(point.value)} />
                <stop
                  offset="100%"
                  stopColor={getHappinessColor(DataPoints[index + 1].value)}
                />
              </linearGradient>
            ))}
          </defs>
          {DataPoints.slice(0, -1).map((point, index) => {
            const x1 = mapIndexToX(index);
            const y1 = mapValueToY(point.value);
            const x2 = mapIndexToX(index + 1);
            const y2 = mapValueToY(DataPoints[index + 1].value);

            return (
              <motion.path
                key={index}
                d={`M ${x1} ${y1} L ${x2} ${y2}`}
                stroke={`url(#gradient-${index})`}
                strokeWidth={strokeWidth}
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                  delay: index * 0.2,
                }}
              />
            );
          })}
        </svg>

        {/* Data point images */}
        {DataPoints.map((point, index) => (
          <motion.img
            key={index}
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
            transition={{ delay: index * 0.2, duration: 0.1 }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default LineGraph;
