"use client";

import React, { useMemo } from "react";
import { Flex, useTheme } from "@chakra-ui/react";
import { AgCharts } from "ag-charts-react";
import useColor from "@/hooks/useColor";

import {
  AgBarSeriesItemStylerParams,
  AgCartesianChartOptions,
  AgCartesianSeriesTooltipRendererParams,
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

  // Replace your old tooltip renderer with the appearance from the Dashboard snippet.
  const tooltipRenderer = (params: AgCartesianSeriesTooltipRendererParams) => {
    // Because you have custom fields (title, value, count),
    // you can destructure them from `params.datum`.
    const datum = params.datum as DataPoint;

    // params.color is the fill color used for the bar/marker
    // params.xKey and params.yKey are the keys you defined in series
    // so xKey => 'title', yKey => 'value'
    // We'll show `title`, `value`, and `count`.
    return `<div class="ag-chart-tooltip-title" style="background-color:${params.color}">
        ${datum.title}
      </div>
      <div class="ag-chart-tooltip-content">
        Score: ${datum.value.toFixed(1)}<br/>
        Count: ${datum.count}
      </div>`;
  };

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
          // Use the new renderer function we created
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
            fontWeight: "bold",
            rotation: -45,
            color: theme.colors.perygonPink,
            formatter: ({ value }: { value: string }) =>
              value.length > 8 ? `${value.slice(0, 8)}...` : value,
          },
        },
        {
          type: "number",
          position: "left",
          label: {
            enabled: true,
            fontSize: 12,
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
        enabled: true,
      },
    }),
    [validData, getColor, onBarClick, theme.colors.perygonPink]
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
        /* Additional styling for the new tooltip (optional) */
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
        style={{ width: "100%", height: "100%" }}
      />
    </Flex>
  );
};
