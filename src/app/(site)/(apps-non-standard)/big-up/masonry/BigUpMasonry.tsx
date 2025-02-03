"use client";
import { Grid, GridItem } from "@chakra-ui/react";
import { ReactNode } from "react";
import { MyBigUpStats } from "./MyBigUpStats";
import { MasonryCard } from "./MasonryCardItem";
import { SpringScale } from "@/components/animations/SpringScale";
import { BigUpStats } from "../types";

export interface BigUpMasonryProps {
  items: { title: string; content: ReactNode }[];
  userStats: BigUpStats;
}

export const BigUpMasonry: React.FC<BigUpMasonryProps> = ({
  items,
  userStats,
}) => {
  return (
    <Grid
      w="100%"
      templateColumns={["1fr", "repeat(2, 1fr)"]}
      gap={[3, null, null, 5]}
      height="100%"
    >
      <GridItem colSpan={[1, 2]}>
        <SpringScale
          delay={Math.random() * 0.5}
          style={{ flex: 1, height: "100%" }}
        >
          <MyBigUpStats
            name={userStats.userName}
            location={userStats.userLocation}
            received={userStats.bigUpReceivedPoints}
            given={userStats.bigUpGivenPoints}
            score={userStats.bigUpTotal}
            userImage={userStats.userImage}
            ranking={userStats.bigUpRanking}
          />
        </SpringScale>
      </GridItem>

      {items &&
        items.map((item, index) => (
          <GridItem key={index} height="100%">
            <SpringScale
              delay={Math.random() * 0.5}
              style={{ flex: 1, height: "100%" }}
            >
              <MasonryCard title={item.title} content={item.content} />
            </SpringScale>
          </GridItem>
        ))}
    </Grid>
  );
};
