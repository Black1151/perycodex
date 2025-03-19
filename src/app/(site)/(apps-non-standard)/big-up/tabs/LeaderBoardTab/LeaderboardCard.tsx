import React from "react";
import { Flex, Avatar, Text, Divider, BoxProps } from "@chakra-ui/react";
import Card from "../../components/Card";
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
  onClickProfilePic: (UUID: string) => void;
  UUID: string;
}

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({
  name,
  UUID,
  location,
  received,
  given,
  score,
  image,
  rank,
  medalColor,
  onClickProfilePic,
  ...props
}) => {
  return (
    <Card
      width="100%"
      bg="perygonBlueTransparent"
      boxShadow="0 0 10px 2px rgba(192, 192, 192, 0.8)"
      {...props}
    >
      <Flex align="center" mb={3}>
        <Avatar
          size="lg"
          name={name}
          src={image}
          onClick={() => onClickProfilePic(UUID)}
          _hover={{ cursor: "pointer" }}
        />
        <Flex direction="column" ml={4} flex="1">
          <Text fontWeight="bold" fontSize="xl" color="primary">
            {name}
          </Text>
          <Text fontSize="sm" color="white">
            {location}
          </Text>
        </Flex>
      </Flex>
      <Flex
        alignItems="center"
        mb={2}
        width="100%"
        justifyContent="flex-end"
        minHeight="40px"
      >
        {medalColor && (
          <EmojiEvents
            style={{ color: medalColor, marginRight: "0.5rem" }}
            fontSize="large"
          />
        )}
        <Text fontWeight="bold" color="primary" fontSize="lg" mr={2}>
          {rank}
        </Text>
        <Text
          fontWeight="bold"
          color="primary"
          fontSize="lg"
          whiteSpace="nowrap"
        >
          {score.toLocaleString()} Points!
        </Text>
      </Flex>

      <Divider mb={3} />
      <Flex justify="space-between">
        <Text fontSize="sm" fontWeight="bold" color="white">
          Received:
        </Text>
        <Text fontWeight="bold" fontSize="lg" color="primary">
          {received.toLocaleString()}
        </Text>
      </Flex>
      <Flex justify="space-between" mt={1}>
        <Text fontSize="sm" fontWeight="bold" color="white">
          Given:
        </Text>
        <Text fontWeight="bold" fontSize="lg" color="primary">
          {given.toLocaleString()}
        </Text>
      </Flex>
    </Card>
  );
};
