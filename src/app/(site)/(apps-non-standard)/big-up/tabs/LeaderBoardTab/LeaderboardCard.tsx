import React from "react";
import { Flex, Avatar, Text, Divider } from "@chakra-ui/react";
import Card from "../../Card";

export interface LeaderboardCardProps {
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
}) => {
  return (
    <Card>
      <Flex align="center" mb={3}>
        <Avatar size="sm" name={name} />
        <Flex direction="column" ml={2}>
          <Text fontWeight="bold" fontSize="md">
            {name}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {location}
          </Text>
        </Flex>
        <Text ml="auto" fontWeight="bold" color="green.500" fontSize="lg">
          {score}
        </Text>
      </Flex>
      <Divider mb={3} />
      <Flex justify="space-between">
        <Text fontSize="sm" fontWeight="bold" color="gray.600">
          Received:
        </Text>
        <Text fontWeight="bold" fontSize="lg">
          {received}
        </Text>
      </Flex>
      <Flex justify="space-between" mt={1}>
        <Text fontSize="sm" fontWeight="bold" color="gray.600">
          Given:
        </Text>
        <Text fontWeight="bold" fontSize="lg">
          {given}
        </Text>
      </Flex>
    </Card>
  );
};
