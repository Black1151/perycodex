import React, { useState } from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  keyframes,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import useColor from "@/hooks/useColor";

interface DataPoint {
  value: number;
  title: string;
}

interface BarProps {
  value: number;
  delay: number;
}

const shimmerVertical = keyframes`
  0% {
    background-position: 0 -100%;
  }
  100% {
    background-position: 0 100%;
  }
`;

const Bar: React.FC<BarProps> = ({ value, delay }) => {
  const { getColor } = useColor();

  return (
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: `${value * 10}%` }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box width="100%" maxW={[3, 5, 10]} bg={getColor(value)}>
        <Box
          top={0}
          left={0}
          height="100%"
          background="linear-gradient(30deg, rgba(255,0,112,0) 40%, rgba(255,0,112,0.1) 50%, rgba(255,0,112,0) 0%)"
          backgroundSize="110% 300%"
          sx={{
            animation: `${shimmerVertical} 2s`,
            animationDelay: `${delay + 1}s`,
            animationFillMode: "forwards",
          }}
          onAnimationEnd={(e) => {
            (e.target as HTMLElement).style.animation = "none";
          }}
        />
      </Box>
    </motion.div>
  );
};

interface AnimatedBarChartProps {
  DataPoints: DataPoint[];
}

export const YAxis = () => {
  const yAxisVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.04 + 1,
        type: "ease",
      },
    }),
  };

  return (
    <VStack
      as={motion.div}
      initial="hidden"
      animate="visible"
      height="100%"
      justifyContent="space-between"
      width="100%"
    >
      {Array.from({ length: 11 }, (_, index) => (
        <motion.div
          key={index}
          custom={index}
          variants={yAxisVariants}
          style={{ width: "100%" }}
        >
          <HStack width="100%">
            <Text fontSize="xs" lineHeight={0}>
              {10 - index}
            </Text>
            <Box borderBottom="1px solid lightgrey" w="100%" />
          </HStack>
        </motion.div>
      ))}
    </VStack>
  );
};

const AnimatedBarChart: React.FC<AnimatedBarChartProps> = ({ DataPoints }) => {
  const [isTouchDevice] = useMediaQuery("(hover: none) and (pointer: coarse)");
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  const handleBarClick = (index: number) => {
    if (isTouchDevice) {
      setActiveTooltip(activeTooltip === index ? null : index);
    }
  };

  const theme = useTheme();

  return (
    <VStack
      bg="white"
      width="100%"
      flex={1}
      borderRadius="2xl"
      px={[2, 8]}
      pb={10}
      pt={10}
      position="relative"
      minH={300}
      height={"100%"}
    >
      <HStack alignItems="center" w="100%" h="100%">
        <YAxis />
        <Flex
          height="100%"
          position="absolute"
          pb={10}
          pt={10}
          left={[12, "60px"]}
          right={[12, "60px"]}
          justifyContent="space-between"
          alignItems="flex-end"
        >
          {DataPoints.map((dataPoint, index) => (
            <Tooltip
              key={index}
              label={dataPoint.title}
              bgColor={theme.colors.peryugonPink }
              placement="top"
              isOpen={isTouchDevice ? activeTooltip === index : undefined}
            >
              <VStack
                height="100%"
                alignItems="center"
                justifyContent="flex-end"
                flex={1}
                position="relative"
                onClick={() => handleBarClick(index)}
              >
                <Bar value={dataPoint.value} delay={index * 0.1} />
                <Flex
                  position="absolute"
                  bottom="-30px"
                  height="30px"
                  width="100%"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text
                    lineHeight={1}
                    fontSize={10}
                    textAlign="center"
                    transform="rotate(-90deg)"
                    whiteSpace="nowrap"
                  >
                    {dataPoint.title.length > 5
                      ? dataPoint.title.slice(0, 5) + "..."
                      : dataPoint.title}
                  </Text>
                </Flex>
              </VStack>
            </Tooltip>
          ))}
        </Flex>
      </HStack>
    </VStack>
  );
};

export default AnimatedBarChart;
