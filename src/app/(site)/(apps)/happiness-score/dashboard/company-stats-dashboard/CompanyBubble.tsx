"use client";

import React, { useState } from "react";
import { Box, useTheme } from "@chakra-ui/react";
import { AgCharts } from "ag-charts-react";
import useColor from "@/hooks/useColor";

import {
  AgCartesianChartOptions,
  AgCartesianSeriesOptions,
  BubbleSeriesItemStylerParams,
} from "ag-charts-enterprise";

import BubbleScoresTooltipRenderer from "@/components/agCharts/BubbleScoresTooltipRenderer";

interface UserScores {
  score: number;
  countOfScore: number;
  dayOfSubmission: string;
}

interface CompanyBubble {
  scores?: UserScores[];
}

export const CompanyBubble: React.FC<CompanyBubble> = ({ scores }) => {
  const theme = useTheme();
  const { getColor } = useColor();

  // Parse the scores array safely
  const validScoresArray = (() => {
    try {
      return Array.isArray(scores) ? scores : JSON.parse(scores || "[]");
    } catch (error) {
      return [];
    }
  })();

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const globalMaxCount = Math.max(
    ...validScoresArray.map((d: UserScores) => d.countOfScore)
  );

  const series: AgCartesianSeriesOptions[] = days.map((day) => {
    // Filter the scores for the current day
    const dayData = validScoresArray.filter(
      (d: UserScores) => d.dayOfSubmission === day
    );

    // Find the maximum countOfScore for the current day's data
    const localMaxCount = Math.max(
      ...dayData.map((d: UserScores) => d.countOfScore),
      0
    ); // Default to 0 if dayData is empty

    // Calculate the maxSize for this day based on the global maximum
    const maxSize = (localMaxCount / globalMaxCount) * 100;

    return {
      data: dayData,
      type: "bubble",
      xKey: "score",
      xName: "Score",
      yKey: "dayOfSubmission",
      yName: "Day",
      sizeKey: "countOfScore",
      sizeName: "Submissions",
      size: 0,
      maxSize: maxSize,
      tooltip: {
        renderer: BubbleScoresTooltipRenderer,
      },
      itemStyler: (params: BubbleSeriesItemStylerParams<any>) => {
        const { datum, xKey } = params;
        const score = parseInt(datum[xKey], 10); // Retrieve the score value
        return { fill: getColor(score) }; // Color based on score
      },
    };
  });

  const [options, setOptions] = useState<AgCartesianChartOptions>({
    data: validScoresArray,
    seriesArea: {
      padding: {
        left: 5,
        right: 20,
      },
    },
    series: series,
    axes: [
      {
        type: "category",
        position: "bottom",
        label: {
          fontSize: 12,
          fontFamily: "Metropolis",
          fontWeight: "bold",
          color: theme.colors.primary,
        },
        title: {
          text: "Score",
          fontSize: 12,
          fontFamily: "Metropolis",
          color: "black",
        },
      },
      {
        type: "category",
        position: "left",
        label: {
          fontSize: 10,
          fontFamily: "Metropolis",
          padding: 0,
          color: theme.colors.primary,
        },
      },
    ],
    legend: {
      enabled: false,
    },
    zoom: {
      enabled: false,
    },
    navigator: {
      enabled: false,
    },
    annotations: {
      enabled: false,
    },
  });

  return (
    <Box
      borderRadius={"2xl"}
      shadow={"xl"}
      overflow={"hidden"}
      height={"500px"}
    >
      <AgCharts
        options={options as any}
        style={{ width: "100%", height: "100%" }}
      />
    </Box>
  );
};
