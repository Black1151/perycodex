"use client";

import React, { useMemo } from "react";
import { Flex, useTheme, useMediaQuery } from "@chakra-ui/react";
import { AgCharts } from "ag-charts-react";
import useColor from "@/hooks/useColor";

import {
  AgBarSeriesItemStylerParams,
  AgCartesianChartOptions,
  AgCartesianSeriesTooltipRendererParams,
} from "ag-charts-enterprise";
import { NoDataOverlayPink } from "../agGrids/DataGrid/DataGridComponentLight";
import LoadingOverlayPink from "../agGrids/LoadingOverlayPink";

interface DataPoint {
  title: string;
  value: number;
  count: number;
}

interface AgBarChartProps {
  data: DataPoint[] | null;
  loading?: boolean;
  onBarClick?: (title: string) => void;
}

export const AgBarChart: React.FC<AgBarChartProps> = ({
  data,
  loading = false,
  onBarClick,
}) => {
  const theme = useTheme();
  const { getColor } = useColor();

  const [isMobile] = useMediaQuery("(max-width: 48em)", {
    ssr: false,
  });

  const validData = useMemo(
    () =>
      Array.isArray(data) ? [...data].sort((a, b) => a.value - b.value) : [],
    [data]
  );

  const tooltipRenderer = (params: AgCartesianSeriesTooltipRendererParams) => {
    const datum = params.datum as DataPoint;
    return `
      <div class="ag-chart-tooltip-title"
           style="background-color:${params.color}; border: 1px solid white; border-radius: 8px 8px 0 0;">
        ${datum.title}
      </div>
      <div class="ag-chart-tooltip-content"
           style="border: 1px solid white; border-radius: 0 0 8px 8px;">
        Score: ${datum.value.toFixed(1)}<br/>
        Count: ${datum.count}
      </div>`;
  };

  const chartOptions: AgCartesianChartOptions = useMemo(
    () => ({
      data: validData,
      padding: {
        top: 40,
        left: 10,
        right: 20,
        bottom: 20,
      },
      series: [
        {
          type: "bar",
          xKey: "title",
          yKey: "value",
          xName: "Score",
          cornerRadius: 10,
          shadow: {
            enabled: true,
            color: "#191919",
            xOffset: 1,
            yOffset: 1,
            blur: 4,
          },
          label: {
            enabled: isMobile || false,
            placement: "inside",
            color: isMobile ? theme.colors.perygonPink : "black",
            fontSize: 10,
            fontWeight: "bold",
            formatter: ({ value }: { value: number }) => value.toFixed(1),
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
            renderer: tooltipRenderer,
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
            rotation: -65,
            color: theme.colors.perygonPink,
          },
        },
        {
          type: "number",
          position: "left",
          interval: { step: 2 },
          min: 0,
          max: 10,
        },
      ],
      legend: { enabled: false },
      zoom: { enabled: false },
      navigator: { enabled: false },
      tooltip: { enabled: true },
    }),
    [validData, getColor, isMobile, onBarClick, theme.colors.perygonPink]
  );

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100%">
        <LoadingOverlayPink />
      </Flex>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Flex
        borderRadius="2xl"
        shadow="xl"
        overflow="hidden"
        width="100%"
        height="100%"
        bg="white"
      >
        <NoDataOverlayPink />
      </Flex>
    );
  }

  return (
    <Flex
      borderRadius="2xl"
      shadow="xl"
      overflow="hidden"
      width="100%"
      height="100%"
      flex={1}
    >
      <style jsx global>{`
        .ag-charts-container rect:hover {
          transition: filter 0.3s ease-in-out;
          filter: drop-shadow(0 0 10px ${theme.colors.pink[400]});
        }
        .ag-chart-tooltip-title {
          font-weight: bold;
          padding: 4px 8px;
          color: #fff;
        }
        .ag-chart-tooltip-content {
          padding: 4px 8px;
          background: #fff;
          color: #000;
        }
      `}</style>
      <AgCharts
        options={chartOptions as any}
        style={{ width: "100%", height: "600px" }}
      />
    </Flex>
  );
};
