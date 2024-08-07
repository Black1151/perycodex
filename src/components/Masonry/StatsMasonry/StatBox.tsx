import Counter from "@/components/counter/Counter";
import { Flex, Text, useTheme, VStack } from "@chakra-ui/react";

interface StatBoxProps {
  bgColor: string;
  data: string;
  title: string;
  counterColor?: string;
}

export const StatBox: React.FC<StatBoxProps> = ({
  bgColor,
  title,
  data,
  counterColor,
}) => {
  const theme = useTheme();

  return (
    <VStack
      bg="white"
      justifyContent="center"
      alignItems="center"
      direction="column"
      borderRadius="2xl"
      overflow="hidden"
    >
      <Flex flex={1} justifyContent="center" alignItems="center" p={6} pb={2}>
        <Counter
          value={parseInt(data)}
          color={counterColor ?? theme.colors.perygonPink}
          fontSize={[40, 50]}
          fontWeight="bold"
          p={8}
        />
      </Flex>
      <Flex bg={bgColor} flex={2} w="100%" justifyContent="center" p={2}>
        <Text color="white" fontWeight="bold" fontSize={[20, 25]}>
          {title}
        </Text>
      </Flex>
    </VStack>
  );
};
