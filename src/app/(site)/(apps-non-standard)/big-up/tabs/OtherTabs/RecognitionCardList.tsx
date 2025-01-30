"use client";

import React from "react";
import { Box, Grid, Avatar, Text, Flex } from "@chakra-ui/react";
import {
  AnimatedList,
  AnimatedListItem,
} from "@/components/animations/AnimatedList";
import { BigUpWallEntry } from "../../types";

interface RecognitionListProps {
  items: BigUpWallEntry[];
}

export const RecognitionList: React.FC<RecognitionListProps> = ({ items }) => {
  return (
    <Grid
      templateColumns={["1fr", null, "1fr 1fr", null, null, "1fr 1fr"]}
      gap={6}
    >
      <AnimatedList>
        {items &&
          items.map((item, index) => (
            <AnimatedListItem key={item.userIdUrlTo} index={index}>
              <Box
                bg="rgba(0, 0, 0, 0.85)"
                boxShadow="0 0 10px 2px rgba(255, 20, 147, 0.8)"
                p={4}
                rounded="md"
              >
                <Flex alignItems="center" justify="space-between">
                  <Flex flexDirection="column" flex="1">
                    <Text fontSize="xl" color="perygonPink" fontWeight="bold">
                      {item.userNameTo}
                    </Text>
                    <Text fontSize="xs" color="white">
                      recognised by {item.userNameFrom}
                    </Text>
                    <Text fontSize="xs" color="pink.300" pt={1}>
                      {item.createdAt.split(" ")[0]}
                    </Text>
                    <Text
                      mt={1}
                      fontSize="lg"
                      color="perygonPink"
                      fontWeight="bold"
                    >
                      {item.bigUpCategory}
                    </Text>
                  </Flex>
                  <Avatar
                    size="xl"
                    name={item.userNameTo}
                    src={item.userImageUrlTo}
                  />
                </Flex>
                <Box mt={4}>
                  <Text fontSize="sm" color="white">
                    {item.bigUpMessage}
                  </Text>
                </Box>
              </Box>
            </AnimatedListItem>
          ))}
      </AnimatedList>
    </Grid>
  );
};
