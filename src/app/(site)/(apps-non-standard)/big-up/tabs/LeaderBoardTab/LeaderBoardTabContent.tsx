"use client";
import React from "react";
import { Grid } from "@chakra-ui/react";
import { LeaderboardCard } from "./LeaderboardCard";
import {
  AnimatedList,
  AnimatedListItem,
} from "@/components/animations/AnimatedList";
import { BigUpLeaderboardEntry } from "../../types";

interface LeaderBoardTabContentProps {
  items: BigUpLeaderboardEntry[];
}

export const LeaderBoardTabContent: React.FC<LeaderBoardTabContentProps> = ({
  items,
}) => {
  return (
    <Grid templateColumns={["1fr", null, "1fr 1fr", "1fr", "1fr 1fr"]} gap={6}>
      <AnimatedList>
        {items &&
          items.map((item, index) => (
            <AnimatedListItem delay={0.5} key={index} index={index}>
              <LeaderboardCard
                name={item.userName}
                location={item.officeName}
                received={item.bigUpReceived}
                given={item.bigUpGiven}
                score={item.bigUpTotal}
              />
            </AnimatedListItem>
          ))}
      </AnimatedList>
    </Grid>
  );
};
