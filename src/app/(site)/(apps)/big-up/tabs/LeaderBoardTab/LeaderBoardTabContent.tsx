import React from "react";
import { Grid } from "@chakra-ui/react";
import { LeaderboardCard, LeaderboardCardProps } from "./LeaderboardCard";

interface LeaderBoardTabContentProps {
  items: LeaderboardCardProps[];
}

export const LeaderBoardTabContent: React.FC<LeaderBoardTabContentProps> = ({
  items,
}) => {
  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
      {items.map((item, index) => (
        <LeaderboardCard
          key={index}
          name={item.name}
          location={item.location}
          received={item.received}
          given={item.given}
          score={item.score}
        />
      ))}
    </Grid>
  );
};
