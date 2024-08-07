import React from "react";
import { Box, Flex, VStack, HStack, Text, keyframes } from "@chakra-ui/react";
import { motion } from "framer-motion";
import useColor from "@/hooks/useColor";
import { truncateText } from "../../utils/utils";

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
        height: "300px",
      }}
    >
      <Box
        minW="20px"
        maxW="30px"
        height="100%"
        bg={getColor(value)}
        overflow="hidden"
      >
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

const YAxis = () => {
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
      height="300px"
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

/////////////////////

const AnimatedBarChart: React.FC<AnimatedBarChartProps> = ({ DataPoints }) => {
  return (
    <VStack
      bg="white"
      width="100%"
      flex={1}
      borderRadius={8}
      p={[2, 8]}
      pb={10}
      pt={10}
      position="relative"
    >
      <HStack alignItems="center" w="100%">
        <YAxis />
        <HStack
          height="300px"
          position="absolute"
          left={[12, "60px"]}
          justifyContent="space-between"
          w={[250, 350, 600, 480]}
        >
          {DataPoints.map((dataPoint, index) => (
            <VStack
              key={index}
              height="100%"
              alignItems="center"
              justifyContent="flex-end"
            >
              <Bar value={dataPoint.value} delay={index * 0.1} />
              <Text
                bottom={-3}
                position="absolute"
                lineHeight={0}
                fontSize={10}
              >
                {truncateText(dataPoint.title, 4)}
              </Text>
            </VStack>
          ))}
        </HStack>
      </HStack>
    </VStack>
  );
};

export default AnimatedBarChart;
