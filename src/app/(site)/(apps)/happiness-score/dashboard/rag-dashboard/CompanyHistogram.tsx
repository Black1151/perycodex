"use client";

import React, { useEffect, useState } from "react";
import { Box, Spinner, Text, useTheme } from "@chakra-ui/react";
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

  const [options, setOptions] = useState<AgCartesianChartOptions | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    // Handle initial empty or undefined scoreDistribution
    if (!scoreDistribution || scoreDistribution.length === 0) {
      console.warn("No score distribution data available yet.");
      setIsLoading(true);
      return;
    }

    console.log("Score distribution updated:", scoreDistribution);

    const validScoresArray = Array.isArray(scoreDistribution)
      ? scoreDistribution
      : [];

    setOptions({
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

    setIsLoading(false); // Data is available, stop loading
  }, [scoreDistribution]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" h="100%">
        <Spinner size="lg" />
        <Text ml={4}>Loading data...</Text>
      </Box>
    );
  }

  if (!options) {
    return <Box>No data available</Box>;
  }

  return (
    <Box borderRadius={"2xl"} shadow={"xl"} overflow={"hidden"}>
      <AgCharts options={options as any} />
    </Box>
  );
};
