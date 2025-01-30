import { Card, Flex, Center, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

interface MasonryCardProps {
  title: string;
  content: ReactNode;
}

export const MasonryCard: React.FC<MasonryCardProps> = ({ title, content }) => {
  return (
    <Card bg="rgba(0, 0, 0, 0.85)" height="100%" width="100%" p={4} flex="1">
      <Flex direction="column" justify="center" align="center" height="100%">
        <Text
          fontSize={["lg", null, null, "xs"]}
          fontWeight="bold"
          color="perygonPink"
        >
          {title}
        </Text>
        <Center flex={1} py={4}>
          <Text
            color="perygonPink"
            fontSize={["2xl", null, null, "2xl", null, null, "4xl"]}
          >
            {content}
          </Text>
        </Center>
      </Flex>
    </Card>
  );
};
