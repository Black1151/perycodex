import React from "react";
import { Flex, Avatar, Text, Divider, BoxProps } from "@chakra-ui/react";
import Card from "../../Card";

export interface LeaderboardCardProps extends BoxProps {
  name: string;
  location: string;
  received: number;
  given: number;
  score: number;
}

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({
  name,
  location,
  received,
  given,
  score,
  ...props
}) => {
  return (
    <Card
      width="100%"
      bg="rgba(0, 0, 0, 0.85)"
      boxShadow="0 0 10px 2px rgba(255, 20, 147, 0.8)"
      {...props}
    >
      <Flex align="center" mb={3}>
        <Avatar size="lg" name={name} />
        <Flex direction="column" ml={4}>
          <Text fontWeight="bold" fontSize="xl" color="perygonPink">
            {name}
          </Text>
          <Text fontSize="sm" color="white">
            {location}
          </Text>
        </Flex>
        <Text ml="auto" fontWeight="bold" color="perygonPink" fontSize="lg">
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
    </Card>
  );
};
