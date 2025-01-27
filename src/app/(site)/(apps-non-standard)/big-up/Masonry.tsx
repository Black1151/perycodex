import { Grid, Text, Box, Center, Flex } from "@chakra-ui/react";
import Card from "./Card";
import { ReactNode } from "react";

interface MasonryProps {
  items: { title: string; content: ReactNode }[];
}

export const Masonry: React.FC<MasonryProps> = ({ items }) => {
  return (
    <Grid gridTemplateColumns="repeat(2, 1fr)" gap={20}>
      {items.map((item, index) => (
        <Card key={index} bg="rgba(0, 0, 0, 0.85)" height="100%">
          <Flex
            direction="column"
            justify="center"
            align="center"
            height="100%"
          >
            <Text
              fontSize={["sm", null, null, "2xl", null, null, "4xl"]}
              fontWeight="bold"
              color="perygonPink"
            >
              {item.title}
            </Text>
            <Center flex={1}>
              <Text
                color="perygonPink"
                fontSize={["sm", null, null, "2xl", null, null, "4xl"]}
              >
                {item.content}
              </Text>
            </Center>
          </Flex>
        </Card>
      ))}
    </Grid>
  );
};
