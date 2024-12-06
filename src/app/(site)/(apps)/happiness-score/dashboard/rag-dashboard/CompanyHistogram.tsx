"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Spinner,
  Text,
  useBreakpointValue,
  useTheme,
} from "@chakra-ui/react";
import { AgCharts } from "ag-charts-react";
import useColor from "@/hooks/useColor";

import {
  AgBarSeriesItemStylerParams,
  AgCartesianChartOptions,
} from "ag-charts-enterprise";

interface ScoreDistribution {
  score: number;
  count: number;
}

interface CompanyHistogramProps {
  scoreDistribution?: ScoreDistribution[];
}

export const CompanyHistogram: React.FC<CompanyHistogramProps> = ({
  scoreDistribution,
}) => {
  const theme = useTheme();
  const { getColor } = useColor();

  // Parse the scores array safely and add `yKey` with a default value of 5
  const validScoresArray = (() => {
    try {
      const parsedData = Array.isArray(scoreDistribution)
        ? scoreDistribution
        : JSON.parse(scoreDistribution || "[]");
      return parsedData.sort(
        (a: ScoreDistribution, b: ScoreDistribution) => a.score - b.score,
      );
    } catch (error) {
      return [];
    }
  })();

  const [options, setOptions] = useState<AgCartesianChartOptions>({
    data: validScoresArray,
    padding: {
      top: 20,
      left: 20,
      right: 20,
      bottom: 20,
    },
    series: [
      {
        type: "bar",
        xKey: "score",
        yKey: "count",
        xName: "Score",
        yName: "Count",
        cornerRadius: 10,
        shadow: {
          enabled: true,
          color: "#191919",
          xOffset: 1,
          yOffset: 1,
          blur: 4,
        },
        itemStyler: (params: AgBarSeriesItemStylerParams<any>) => {
          const { datum, xKey } = params;
          const score = parseInt(datum[xKey], 10); // Retrieve the score value
          return { fill: getColor(score) }; // Color based on score
        },
      },
    ],
    axes: [
      {
        type: "category",
        position: "bottom",
        title: {
          text: "Score",
          fontSize: 12,
          fontFamily: "Metropolis",
          color: "black",
        },
        label: {
          fontSize: 12,
          fontFamily: "Metropolis",
          color: theme.colors.perygonPink,
        },
        gridLine: {
          width: 0,
        },
      },
      {
        type: "number",
        position: "left",
        title: {
          text: "Number of times",
          fontSize: 12,
          fontFamily: "Metropolis",
          color: "black",
        },
        label: {
          fontSize: 12,
          fontFamily: "Metropolis",
          color: theme.colors.perygonPink,
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
    tooltip: {
      enabled: false,
    },
  });

  return (
    <Box borderRadius={"2xl"} shadow={"xl"} overflow={"hidden"}>
      <AgCharts options={options as any} />
    </Box>
  );
};
