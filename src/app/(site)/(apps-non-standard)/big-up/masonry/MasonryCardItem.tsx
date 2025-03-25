import PerygonCard from "@/components/layout/PerygonCard";
import { Flex, Center, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

interface MasonryCardProps {
  title: string;
  content: ReactNode;
}

export const MasonryCard: React.FC<MasonryCardProps> = ({ title, content }) => {
  return (
    <PerygonCard display="flex" height="100%" width="100%" p={4} flex="1">
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        height="100%"
        width="100%"
      >
        <Text
          fontSize={["sm", null, null, "md"]}
          fontWeight="bold"
          color="primaryTextColor"
        >
          {title}
        </Text>
        <Center flex={1} py={4}>
          <Text
            color="themeTextColor"
            fontSize={["2xl", null, null, "2xl", null, null, "4xl"]}
          >
            {content}
          </Text>
        </Center>
      </Flex>
    </PerygonCard>
  );
};
