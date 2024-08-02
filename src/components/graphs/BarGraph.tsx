import React from "react";
import { Box, Flex, VStack, HStack, Text } from "@chakra-ui/react";
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

const Bar: React.FC<BarProps> = ({ value, delay }) => {
  const { getColor } = useColor();

  return (
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: `${value * 10}%` }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      style={{ width: "100%", display: "flex", justifyContent: "center" }}
    >
      <Box width={30} height="100%" bg={getColor(value)} />
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
        delay: index * 0.04,
        type: "ease",
        // stiffness: 100,
      },
    }),
  };

  return (
    <VStack
      as={motion.div}
      initial="hidden"
      animate="visible"
      spacing={2}
      height={300}
      justifyContent="flex-end"
      pb="22px"
      width="800px"
    >
      {Array.from({ length: 11 }, (_, index) => (
        <motion.div key={index} custom={index} variants={yAxisVariants} style={{ width: '100%' }}>
          <HStack width="100%">
            <Text fontSize="xs">{10 - index}</Text>
            <Box borderBottom="1px solid lightgrey" flex="1" />
          </HStack>
        </motion.div>
      ))}
    </VStack>
  );

}

const AnimatedBarChart: React.FC<AnimatedBarChartProps> = ({ DataPoints }) => {

  return (
    <HStack spacing={4} alignItems="center" bg="white" borderRadius={8} p={6}>
      <YAxis />
      {/* <Flex alignItems="flex-end" gap={5} height={300} w={500}>
        {DataPoints.map((dataPoint, index) => (
          <VStack
            key={index}
            width="100px"
            height="100%"
            alignItems="center"
            justifyContent="flex-end"
          >
            <Bar value={dataPoint.value} delay={index * 0.1} />
            <Text fontSize="xs">{dataPoint.title}</Text>
          </VStack>
        ))}
      </Flex> */}
    </HStack>
  );
};

export default AnimatedBarChart;
