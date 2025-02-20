"use client";

import React, { useState, useEffect } from "react";
import AgChartComponent from "@/components/agCharts/AgChartComponent";
import { Flex, VStack, useTheme } from "@chakra-ui/react";
import FilterArea from "@/components/DashboardFilterDrawer/FilterArea";
import {
  AgChartOptions,
  AgRadialGaugeOptions,
  AgPolarChartOptions,
  AgPieSeriesOptions,
} from "ag-charts-types";
import AgGaugeComponent from "@/components/agCharts/AgGaugeComponent";
import PieChartToolTipRenderer from "@/components/agCharts/PieChartTooltipRenderer";
import SubmissionsTooltipRenderer from "@/components/agCharts/SubmissionsTooltipRenderer";
import ScoreTooltipRenderer from "@/components/agCharts/ScoreTooltipRenderer";
import { useFetchClient } from "@/hooks/useFetchClient";
import useColor from "@/hooks/useColor";
import { dateRangeOptions } from "@/components/DashboardFilterDrawer/dateRangeUtils";
import NoDataOverlay from "@/components/agGrids/NoDataOverlay";

interface enpsMainDashboardResponse {
  resource: {
    gauge: GaugeData;
    histogram: HistogramRecord[];
    monthlyLineChart: LineDataRecord[];
    pieChart: PieChartDataRecord[];
  };
}

interface GaugeData {
  minScore: number;
  maxScore: number;
  value: number;
  count?: number;
}

interface HistogramRecord {
  value: number;
  count: number;
}

interface LineDataRecord {
  monthYear: string;
  value: number;
}

interface PieChartDataRecord {
  category: string;
  value: number;
}

const AllEnpsDashboard = () => {
  const [filterOptions, setFilterOptions] = useState<Record<string, any>>({});
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { fetchClient } = useFetchClient();
  const { getColor } = useColor();

  const [gaugeData, setGaugeData] = useState<GaugeData>({
    minScore: -100,
    maxScore: 100,
    value: 0,
    count: undefined,
  });
  const [histogramData, setHistogramData] = useState<HistogramRecord[]>([]);
  const [lineChartData, setLineChartData] = useState<LineDataRecord[]>([]);
  const [pieChartData, setPieChartData] = useState<PieChartDataRecord[]>();

  const gaugeOptions: AgRadialGaugeOptions = {
    type: "radial-gauge",
    value: gaugeData.value,
    scale: {
      min: gaugeData.minScore,
      max: gaugeData.maxScore,
    },
    secondaryLabel: {
      text: "eNPS Score",
    },
    cornerMode: "item",
    cornerRadius: 99,
    startAngle: 225,
    endAngle: 495,
    bar: {
      fills: [
        { color: "red", stop: -100 },
        { color: theme.colors.yellow, stop: 0 },
        { color: theme.colors.seduloGreen, stop: 100 },
      ],
      fillMode: "continuous",
    },
    segmentation: {
      enabled: true,
      interval: {
        count: 3,
      },
      spacing: 4,
    },
  };

  const histogramOptions: AgChartOptions = {
    series: [
      {
        type: "bar",
        xKey: "value",
        yKey: "count",
        yName: "Count of Scores",
        cornerRadius: 10,
        shadow: {
          enabled: true,
          color: "#191919",
          xOffset: 1,
          yOffset: 1,
          blur: 4,
        },
        itemStyler: (params) => {
          const { datum, xKey } = params;
          const score = datum[xKey];

          let color = "";

          if (score < 7) {
            color = "red";
          } else if (score < 9) {
            color = theme.colors.yellow;
          } else {
            color = theme.colors.seduloGreen;
          }

          return {
            fill: color,
          };
        },
        tooltip: {
          renderer: SubmissionsTooltipRenderer,
        },
      },
    ],
    axes: [
      {
        type: "category",
        position: "bottom",
        label: {
          fontSize: 12,
          color: theme.colors.perygonPink,
        },
        gridLine: {
          width: 0,
        },
      },
      {
        type: "number",
        position: "left",
        label: {
          fontSize: 12,
          color: theme.colors.perygonPink,
        },
      },
    ],
    data: histogramData,
  };

  const lineChartOptions: AgChartOptions = {
    data: lineChartData,
    series: [
      {
        type: "line",
        yKey: "value",

        xKey: "monthYear",
        stroke: theme.colors.perygonPink,
        interpolation: {
          type: "smooth",
        },
        tooltip: {
          renderer: ScoreTooltipRenderer,
        },
        marker: {
          enabled: true,
          itemStyler: (params) => {
            const { datum, yKey } = params;
            const score = datum[yKey];
            const fillColor = getColor(score);

            return {
              fill: fillColor,
              size: 10,
            };
          },
        },
      },
    ],
    axes: [
      {
        type: "category",
        position: "bottom",
        label: {
          rotation: 300,
          fontSize: 12,
          color: theme.colors.perygonPink,
        },
        gridLine: {
          width: 0,
        },
      },
      {
        type: "number",
        position: "left",
        min: -100,
        max: 100,
        title: {
          text: "eNPS Score",
          fontSize: 12,
          color: theme.colors.perygonPink,
        },
        label: {
          fontSize: 12,
          color: theme.colors.perygonPink,
        },
      },
    ],
    padding: { top: 20, left: 20, right: 20, bottom: 50 },
    legend: { enabled: false },
    zoom: { enabled: false },
    navigator: { enabled: false },
  };

  const pieChartSeries: AgPieSeriesOptions<any> = {
    type: "pie",
    angleKey: "value",
    calloutLabelKey: "category",
    calloutLabel: {
      color: theme.colors.perygonPink,
      fontSize: 12,
    },
    sectorLabelKey: "value",
    radiusKey: "yield",
    itemStyler: (params) => {
      const { datum } = params;
      const category = datum.category;

      let color = "";
      if (category === "Promoters") {
        color = theme.colors.seduloGreen;
      } else if (category === "Passives") {
        color = theme.colors.yellow;
      } else if (category === "Detractors") {
        color = "red";
      }
      return { fill: color };
    },
    tooltip: {
      enabled: true,
      renderer: PieChartToolTipRenderer,
    },
  };

  const pieChartOptions: AgPolarChartOptions = {
    data: pieChartData,
    series: [pieChartSeries],
  };

  function safeJsonParse(str: any) {
    try {
      return JSON.parse(str);
    } catch (err) {
      console.error("Could not parse JSON:", err);
      return null; // or some default fallback
    }
  }

  const getData = async (postBody: Record<string, any> = filterOptions) => {
    setIsLoading(true);
    try {
      const response = await fetchClient<enpsMainDashboardResponse>(
        "/api/enps/dashboards/company-enps",
        {
          method: "POST",
          body: postBody,
          redirectOnError: false,
        },
      );

      if (response && response.resource) {
        setGaugeData(safeJsonParse(response.resource.gauge));
        setHistogramData(safeJsonParse(response.resource.histogram));
        setLineChartData(safeJsonParse(response.resource.monthlyLineChart));
        setPieChartData(safeJsonParse(response.resource.pieChart));
      } else {
        console.error("Invalid response:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onFilterChange = (postBody: Record<string, any>) => {
    setFilterOptions(postBody);
    getData(postBody);
  };

  const dateRangeOption = "monthly";
  const defaultDateFilterOption = "last6Months";

  useEffect(() => {
    const monthlyOption = dateRangeOptions[dateRangeOption].find(
      (opt) => opt.value === defaultDateFilterOption,
    );

    if (monthlyOption) {
      const [startDate, endDate] = monthlyOption.getRange();
      getData({ startDate, endDate });
    } else {
      getData();
    }
  }, []);

  return (
    <VStack align="stretch" spacing={6} w="full" py={4}>
      <FilterArea
        onApplyFilters={onFilterChange}
        filterOptions={{
          showDepartmentsFilter: false,
          showSitesFilter: false,
          showDateFilter: true,
        }}
        dateFilterMode={dateRangeOption}
        defaultDateFilter={defaultDateFilterOption}
      />
      <Flex w={"100%"} gap={6} flexWrap={"wrap"}>
        {/* Gauge */}
        <AgGaugeComponent
          flex={"1 1 45%"}
          title={"eNPS Score"}
          chartOptions={gaugeOptions}
          noData={gaugeData.count === 0 || !gaugeData.count}
        />

        {/* Pie Chart */}
        <AgChartComponent
          flex={"1 1 45%"}
          title={"Category Breakdown"}
          chartOptions={pieChartOptions}
          noData={pieChartData?.length === 0}
        />

        {/* Histogram */}
        <AgChartComponent
          flex={"1 1 45%"}
          title={"Score Spread"}
          chartOptions={histogramOptions}
          noData={histogramData.length === 0}
        />

        {/* Line Chart */}
        <AgChartComponent
          flex={"1 1 45%"}
          title={"eNPS Trend"}
          chartOptions={lineChartOptions}
          noData={lineChartData.length === 0}
        />
      </Flex>
    </VStack>
  );
};
export default AllEnpsDashboard;
