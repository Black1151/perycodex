import { Grid, Text, Box } from "@chakra-ui/react";
import Card from "./Card";
import { ReactNode } from "react";

interface MasonryProps {
  items: { title: string; content: ReactNode }[];
}

export const Masonry: React.FC<MasonryProps> = ({ items }) => {
  return (
    <Grid gridTemplateColumns="repeat(2, 1fr)" gap={4}>
      {items.map((item, index) => (
        <Card key={index}>
          <Box textAlign="center">
            <Text fontSize="xl" fontWeight="bold">
              {item.title}
            </Text>
            <Text mt={4}>{item.content}</Text>
          </Box>
        </Card>
      ))}
    </Grid>
  );
};
