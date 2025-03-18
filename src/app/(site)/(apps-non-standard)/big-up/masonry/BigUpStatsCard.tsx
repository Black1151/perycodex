import React from "react";
import { Flex, Avatar, Text, Divider } from "@chakra-ui/react";
import Card from "../components/Card";
import {
  getMedalColor,
  getOrdinalSuffix,
} from "@/app/(site)/(apps-non-standard)/big-up/tabs/LeaderBoardTab/LeaderBoardTabContent";
import { EmojiEvents } from "@mui/icons-material";
import Link from "next/link";

export interface BigUpStatsCardProps {
  name: string;
  location: string;
  received: number;
  given: number;
  score: number;
  userImage: string;
  ranking?: number;
  handleProfilePicClick: (uuid: string) => void;
  UUID: string;
}

export const BigUpStatsCard: React.FC<BigUpStatsCardProps> = ({
  name,
  location,
  received,
  given,
  score,
  userImage,
  ranking,
  handleProfilePicClick,
  UUID,
}) => {
  const medalColor = ranking ? getMedalColor(ranking) : "white";

  const rankOrdinal = ranking && getOrdinalSuffix(ranking);

  return (
    <Card
      width="100%"
      height="100%"
      bg="perygonBlueTransparent"
      justifyContent="space-between"
    >
      <Flex flexDirection="column" justifyContent="space-between" height="100%">
        <Flex align="center" mb={3} gap={5}>
          <Avatar
            size="xl"
            name={name}
            src={userImage}
            onClick={() => handleProfilePicClick(UUID)}
            _hover={{ cursor: "pointer" }}
          />
          <Flex
            direction="column"
            ml={2}
            height="100%"
            flex={1}
            alignItems="left"
            justifyContent="center"
          >
            <Text
              fontWeight="bold"
              fontSize={["sm", "md", "xl"]}
              color="perygonPink"
            >
              {name}
            </Text>
            <Text fontSize={["sm", "md", "xl"]} color="white" fontWeight="bold">
              {location}
            </Text>
          </Flex>
          <Flex align="center">
            {ranking ? (
              <>
                {medalColor && (
                  <EmojiEvents
                    style={{ color: medalColor, marginRight: "0.5rem" }}
                    fontSize="large"
                  />
                )}
                <Text
                  fontWeight="bold"
                  color="perygonPink"
                  fontSize={["sm", "lg"]}
                >
                  {!medalColor && "Rank: "}
                  {rankOrdinal}
                </Text>
              </>
            ) : (
              <Text
                fontWeight="bold"
                color="perygonPink"
                fontSize={["sm", "lg"]}
              >
                No Ranking
              </Text>
            )}
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
            {score.toLocaleString()}
          </Text>
        </Flex>
        <Divider mb={3} />
        <Flex justify="space-between">
          <Text fontSize="sm" fontWeight="bold" color="white">
            Received:
          </Text>
          <Text fontWeight="bold" fontSize="lg" color="perygonPink">
            {received.toLocaleString()}
          </Text>
        </Flex>
        <Flex justify="space-between" mt={1}>
          <Text fontSize="sm" fontWeight="bold" color="white">
            Given:
          </Text>
          <Text fontWeight="bold" fontSize="lg" color="perygonPink">
            {given.toLocaleString()}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
};
