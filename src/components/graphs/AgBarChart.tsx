"use client";

import React, { useMemo } from "react";
import { Flex, useTheme } from "@chakra-ui/react";
import { AgCharts } from "ag-charts-react";
import useColor from "@/hooks/useColor";

import {
  AgBarSeriesItemStylerParams,
  AgCartesianChartOptions,
} from "ag-charts-enterprise";

interface DataPoint {
  title: string;
  value: number;
  count: number;
}

interface AgBarChartProps {
  data: DataPoint[];
  onBarClick?: (title: string) => void;
}

export const AgBarChart: React.FC<AgBarChartProps> = ({ data, onBarClick }) => {
  const theme = useTheme();
  const { getColor } = useColor();

  const validData = useMemo(
    () =>
      Array.isArray(data) ? [...data].sort((a, b) => a.value - b.value) : [],
    [data]
  );

  const chartOptions: AgCartesianChartOptions = useMemo(
    () => ({
      data: validData,
      padding: {
        top: 20,
        left: 40, // Keep enough space for the y-axis labels
        right: 20,
        bottom: 20,
      },
      series: [
        {
          type: "bar",
          xKey: "title",
          yKey: "value",
          xName: "Score",
          // yName: "Count",
          cornerRadius: 10,
          shadow: {
            enabled: true,
            color: "#191919",
            xOffset: 1,
            yOffset: 1,
            blur: 4,
          },
          itemStyler: (params: AgBarSeriesItemStylerParams<any>) => {
            const { datum } = params;
            const score = datum.value;
            return { fill: getColor(score) };
          },
          highlightStyle: {
            item: {
              strokeWidth: 0,
              fillOpacity: 1,
            },
          },
          tooltip: {
            renderer: (params: any) => {
              const dp = params.datum as DataPoint;
              return {
                content: `
                  <div style="text-align:center;">
                    <strong>${dp.title}</strong><br/>
                    Score: ${dp.value.toFixed(1)}<br/>
                    Count: ${dp.count}
                  </div>
                `,
              };
            },
          },
          listeners: {
            nodeClick: (event: any) => {
              if (onBarClick) {
                onBarClick(event.datum.title);
              }
            },
          },
        },
      ],
      axes: [
        {
          type: "category",
          position: "bottom",
          label: {
            fontSize: 12,
            fontWeight: "bold",
            rotation: -45,
            formatter: ({ value }: { value: string }) =>
              value.length > 8 ? `${value.slice(0, 8)}...` : value, // Truncate to 8 characters
          },
        },
        {
          type: "number",
          position: "left",

          label: {
            enabled: true,
            fontSize: 12,
            color: theme.colors.gray[600],
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
        enabled: true,
      },
    }),
    [validData, getColor, onBarClick]
  );

  return (
    <Flex
      borderRadius="2xl"
      shadow="xl"
      overflow="hidden"
      width="100%"
      height="100%"
    >
      <style jsx global>{`
        .ag-charts-container rect:hover {
          transition: filter 0.3s ease-in-out;
          filter: drop-shadow(0 0 10px ${theme.colors.pink[400]});
        }
      `}</style>
      <AgCharts
        options={chartOptions as any}
        style={{ width: "100%", height: "100%" }}
      />
    </Flex>
  );
};
