import React from "react";
import { Flex, Avatar, Text, Divider } from "@chakra-ui/react";
import Card from "../Card";

export interface MyBigUpStatsProps {
  name: string;
  location: string;
  received: number;
  given: number;
  score: number;
  userImage: string;
}

export const MyBigUpStats: React.FC<MyBigUpStatsProps> = ({
  name,
  location,
  received,
  given,
  score,
  userImage,
}) => {
  return (
    <Card
      width="100%"
      height="100%"
      bg="rgba(0, 0, 0, 0.85)"
      justifyContent="space-between"
    >
      <Flex flexDirection="column" justifyContent="space-between" height="100%">
        <Flex align="center" mb={3} gap={5}>
          <Avatar size="xl" name={name} src={userImage} />
          <Flex
            direction="column"
            ml={2}
            height="100%"
            flex={1}
            alignItems="left"
            justifyContent="center"
          >
            <Text fontWeight="bold" fontSize="xl" color="perygonPink">
              {name}
            </Text>
            <Text fontSize="sm" color="white" fontWeight="bold">
              {location}
            </Text>
          </Flex>
        </Flex>
        <Flex>
          <Text color="white" fontWeight="bold">
            Your score is:
          </Text>
          <Text
            ml="auto"
            fontWeight="bold"
            color="perygonPink"
            fontSize={["xl", null, null, "2xl", null, "4xl"]}
          >
            {score}
          </Text>
        </Flex>
        <Divider mb={3} />
        <Flex justify="space-between">
          <Text fontSize="sm" fontWeight="bold" color="white">
            Received:
          </Text>
          <Text fontWeight="bold" fontSize="lg" color="perygonPink">
            {received}
          </Text>
        </Flex>
        <Flex justify="space-between" mt={1}>
          <Text fontSize="sm" fontWeight="bold" color="white">
            Given:
          </Text>
          <Text fontWeight="bold" fontSize="lg" color="perygonPink">
            {given}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
};
