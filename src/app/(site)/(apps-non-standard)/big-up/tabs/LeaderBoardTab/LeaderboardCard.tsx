import React from "react";
import { Flex, Avatar, Text, Divider, BoxProps } from "@chakra-ui/react";
import Card from "../../Card";
import { EmojiEvents } from "@mui/icons-material";

export interface LeaderboardCardProps extends BoxProps {
  name: string;
  location: string;
  received: number;
  given: number;
  score: number;
  image: string;
  rank: string;
  medalColor?: string;
}

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({
  name,
  location,
  received,
  given,
  score,
  image,
  rank,
  medalColor,
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
        <Avatar size="lg" name={name} src={image} />
        <Flex direction="column" ml={4}>
          <Text fontWeight="bold" fontSize="xl" color="perygonPink">
            {name}
          </Text>
          <Text fontSize="sm" color="white">
            {location}
          </Text>
        </Flex>
        <Flex ml="auto" align="center" flexDirection="column">
          <Flex alignItems="center">
            {medalColor && (
              <EmojiEvents
                style={{ color: medalColor, marginRight: "0.5rem" }}
                fontSize="large"
              />
            )}
            <Text fontWeight="bold" color="perygonPink" fontSize="lg" mr={2}>
              {rank}
            </Text>
          </Flex>
          <Text fontWeight="bold" color="perygonPink" fontSize="lg">
            {score} Points!
          </Text>
        </Flex>
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
