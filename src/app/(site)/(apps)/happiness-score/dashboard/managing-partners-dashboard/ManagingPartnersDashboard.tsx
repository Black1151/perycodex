"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  VStack,
  useTheme,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useUser } from "@/providers/UserProvider";
import { useFetchClient } from "@/hooks/useFetchClient";
import { SectionHeader } from "@/components/sectionHeader/SectionHeader";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import UserRenderer from "@/components/agGrids/CellRenderers/UserRenderer";
import HappinessScoreRenderer from "@/components/agGrids/CellRenderers/HappinessScoreRenderer";
import CommentsCellRenderer from "@/components/agGrids/CellRenderers/CommentsCellRenderer";
import { AgCharts } from "ag-charts-react";
import { AgCartesianChartOptions } from "ag-charts-enterprise";
import useColor from "@/hooks/useColor";

interface ManagingPartnersResponse {
  resource: {
    totalAvg: any;
    gridData: any;
    weeklyLineChartComparisonData: any[];
    monthlyLineChartComparisonData: any[];
    currentWeekLeaderboard: any;
    leaderboardData: any;
  };
}

// A helper function to create a separate series for each site name
// (i.e. each key except the xKey).
function generateSiteSeries(siteNames: string[], xKey: string) {
  return siteNames.map((siteName) => ({
    type: "line",
    xKey: xKey, // "week" or "month"
    yKey: siteName, // e.g. "Ambler Club (Leeds)"
    yName: siteName,
    marker: { enabled: true },
    interpolation: { type: "smooth" },
  }));
}

const ManagingPartnersDashboard: React.FC = () => {
  const { fetchClient } = useFetchClient();
  const { user } = useUser();
  const theme = useTheme();
  const { getColor } = useColor();
  const isMobile = useBreakpointValue({ base: true, sm: true, md: false });

  const [isLoading, setIsLoading] = useState(false);

  // State for each piece of data
  const [totalAvg, setTotalAvg] = useState<any[]>([]);
  const [gridData, setGridData] = useState<any[]>([]);
  const [weeklyLineChartComparisonData, setWeeklyLineChartComparisonData] =
    useState<any[]>([]);
  const [monthlyLineChartComparisonData, setMonthlyLineChartComparisonData] =
    useState<any[]>([]);
  const [currentWeekLeaderboard, setCurrentWeekLeaderboard] = useState<any[]>(
    [],
  );
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);

  // Example column definitions for the grid
  const columnDefs = [
    {
      field: "fullName",
      headerName: "Name",
      cellRenderer: UserRenderer,
      sortable: true,
      cellRendererParams: {
        uniqueIdField: "userUniqueId",
        nameField: "fullName",
        imageUrlField: "userImageUrl",
      },
    },
    {
      field: "siteName",
      headerName: "Site",
      sortable: true,
      filter: "agSetColumnFilter",
    },
    {
      field: "deptName",
      headerName: "Department",
      sortable: true,
      filter: "agSetColumnFilter",
    },
    {
      field: "happinessScore",
      headerName: "Score",
      sortable: true,
      cellRenderer: HappinessScoreRenderer,
      filter: "agNumberColumnFilter",
      cellDataType: "number",
    },
    {
      field: "comments",
      headerName: "Comments",
      cellRenderer: CommentsCellRenderer,
    },
  ];

  const defaultColDef = {
    resizable: true,
    filter: true,
    suppressHeaderMenuButton: true,
  };

  // ------------------------------------------------------------------------------
  // 1) Fetch the data from our Next.js API route (which does the flattening)
  // ------------------------------------------------------------------------------
  const getData = async () => {
    setIsLoading(true);
    try {
      // This route calls /getManagingPartnersDashboard on the server,
      // flattens the weekly/monthly data, and returns an object.
      const response = await fetchClient<ManagingPartnersResponse>(
        "/api/happiness-graphs/getMpsData",
      );

      if (response && response.resource) {
        const {
          totalAvg: resTotalAvg,
          gridData: resGridData,
          weeklyLineChartComparisonData: resWeeklyData,
          monthlyLineChartComparisonData: resMonthlyData,
          currentWeekLeaderboard: resWeekLeaderboard,
          leaderboardData: resLeaderboardData,
        } = response.resource;

        // Because the server is already returning them as arrays, just set them:
        setTotalAvg(resTotalAvg);
        setGridData(resGridData);
        setWeeklyLineChartComparisonData(resWeeklyData);
        setMonthlyLineChartComparisonData(resMonthlyData);
        setCurrentWeekLeaderboard(resWeekLeaderboard);
        setLeaderboardData(resLeaderboardData);
      } else {
        console.error("Invalid response:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data once we know we have a user
  useEffect(() => {
    if (user) {
      getData();
    }
  }, [user]);

  // ------------------------------------------------------------------------------
  // 2) Build dynamic "site" lines for the weekly data
  //    The flattened weekly data has shape:
  //    [ { week: '2024-01-07', 'Ambler Club (Leeds)': 7.11, ...}, ... ]
  // ------------------------------------------------------------------------------
  const weeklySiteNames =
    weeklyLineChartComparisonData.length > 0
      ? Object.keys(weeklyLineChartComparisonData[0]).filter(
          (key) => key !== "week",
        )
      : [];

  const weeklySeries = generateSiteSeries(weeklySiteNames, "week");

  // We'll define a weekly chart config that uses `weeklyLineChartComparisonData` and `weeklySeries`.
  const weeklyLineChartOptions = {
    data: weeklyLineChartComparisonData,
    series: weeklySeries,
    axes: [
      {
        type: "category",
        position: "bottom",
        label: {
          rotation: 300,
          fontSize: 12,
          fontFamily: "Metropolis",
          color: theme.colors.perygonPink,
        },
        title: {
          text: "Week",
          fontSize: 12,
          fontFamily: "Metropolis",
          color: "black",
        },
      },
      {
        type: "number",
        position: "left",
        title: {
          text: "Happiness Score",
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
    contextMenu: { enabled: false },
    zoom: { enabled: false },
    navigator: { enabled: false },
    legend: {
      position: "bottom" as const,
    },
    padding: {
      top: 20,
      left: 20,
      right: 20,
      bottom: 50,
    },
  };

  // ------------------------------------------------------------------------------
  // 3) Build dynamic "site" lines for the monthly data
  //    The flattened monthly data has shape:
  //    [ { month: '2024-01-01', 'Ambler Club (Leeds)': 7.11, ...}, ... ]
  //    or might be { monthEnd: '2024-01-01', ... } – depends on your flatten code
  // ------------------------------------------------------------------------------
  const monthlySiteNames =
    monthlyLineChartComparisonData.length > 0
      ? Object.keys(monthlyLineChartComparisonData[0]).filter(
          (key) => key !== "month",
        )
      : [];

  const monthlySeries = generateSiteSeries(monthlySiteNames, "month");

  const monthlyLineChartOptions = {
    data: monthlyLineChartComparisonData,
    series: monthlySeries,
    axes: [
      {
        type: "category",
        position: "bottom",
        label: {
          rotation: 300,
          fontSize: 12,
          fontFamily: "Metropolis",
          color: theme.colors.perygonPink,
        },
        title: {
          text: "Month",
          fontSize: 12,
          fontFamily: "Metropolis",
          color: "black",
        },
      },
      {
        type: "number",
        position: "left",
        title: {
          text: "Happiness Score",
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
    contextMenu: { enabled: false },
    zoom: { enabled: false },
    navigator: { enabled: false },
    legend: {
      position: "bottom" as const,
    },
    padding: {
      top: 20,
      left: 20,
      right: 20,
      bottom: 50,
    },
  };

  // ------------------------------------------------------------------------------
  // 4) Current Week Leaderboard Bar Chart
  // ------------------------------------------------------------------------------
  // Sort descending by 'currentScore'
  const sortedCurrentWeek = [...currentWeekLeaderboard].sort(
    (a, b) => b.currentScore - a.currentScore,
  );

  const currentWeekBarOptions: AgCartesianChartOptions = {
    data: sortedCurrentWeek,
    padding: {
      top: 20,
      left: 20,
      right: 20,
      bottom: 50,
    },
    series: [
      {
        type: "bar",
        xKey: "siteName",
        yKey: "leaderboardScore",
        yName: "Score",
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
          const score = parseInt(datum[xKey], 10);
          return { fill: getColor(score) };
        },
      },
    ],
  };

  // ------------------------------------------------------------------------------
  // 5) Leaderboard for Period Bar Chart
  // ------------------------------------------------------------------------------
  // Sort descending by 'leaderboardScore'
  const sortedLeaderboard = [...leaderboardData].sort(
    (a, b) => b.leaderboardScore - a.leaderboardScore,
  );

  const leaderboardBarOptions: AgCartesianChartOptions = {
    data: sortedLeaderboard,
    padding: {
      top: 20,
      left: 20,
      right: 20,
      bottom: 50,
    },
    series: [
      {
        type: "bar",
        xKey: "siteName",
        yKey: "leaderboardScore",
        yName: "Score",
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
          const score = parseInt(datum[xKey], 10);
          return { fill: getColor(score) };
        },
      },
    ],
    axes: [
      { type: "category", position: "bottom" },
      { type: "number", position: "left" },
    ],
    legend: { position: "bottom" as const },
  };

  // ------------------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------------------
  return (
    <VStack align="stretch" spacing={6} w="full" p={4}>
      {/* Loading Indicator */}
      {isLoading && (
        <Box textAlign="center">
          <p>Loading...</p>
        </Box>
      )}

      {/* Average */}
      <Box
        minW={["100%", "100%", "48%"]}
        flex={1}
        textAlign="center"
        borderRadius="lg"
      >
        <Flex
          width="100%"
          justifyContent={isMobile ? "flex-start" : "center"}
          mb={2}
        >
          <SectionHeader>Average</SectionHeader>
        </Flex>
        <Box
          id="chart2"
          height="400px"
          w="full"
          borderRadius={"2xl"}
          overflow={"hidden"}
        >
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(totalAvg, null, 2)}
          </pre>
        </Box>
      </Box>

      {/* Scores and Comments */}
      <Box
        minW={["100%", "100%", "48%"]}
        flex={1}
        textAlign="center"
        borderRadius="lg"
      >
        <Flex width="100%" justifyContent="center" align="center">
          <SectionHeader>Scores and Comments</SectionHeader>
        </Flex>
        <DataGridComponent
          data={gridData}
          loading={isLoading}
          initialFields={columnDefs}
          showTopBar={true}
          defaultColDef={defaultColDef}
          refreshData={getData}
          enableAutoRefresh={true}
        />
      </Box>

      {/* Weekly Chart */}
      {weeklyLineChartComparisonData.length > 0 && (
        <>
          <Flex width="100%" justifyContent="center">
            <SectionHeader>Weekly Trend</SectionHeader>
          </Flex>
          <Box borderRadius="2xl" shadow="xl" overflow="hidden" height="500px">
            <AgCharts
              options={weeklyLineChartOptions as any}
              style={{ width: "100%", height: "100%" }}
            />
          </Box>
        </>
      )}

      {/* Monthly Chart */}
      {monthlyLineChartComparisonData.length > 0 && (
        <>
          <Flex width="100%" justifyContent="center">
            <SectionHeader>Monthly Comparison</SectionHeader>
          </Flex>
          <Box borderRadius="2xl" shadow="xl" overflow="hidden" height="500px">
            <AgCharts
              options={monthlyLineChartOptions as any}
              style={{ width: "100%", height: "100%" }}
            />
          </Box>
        </>
      )}

      {/* Current Week Leaderboard */}
      <Flex width="100%" justifyContent="center" align="center">
        <SectionHeader>Current Week Leaderboard</SectionHeader>
      </Flex>
      <Box borderRadius="2xl" shadow="xl" overflow="hidden" height="500px">
        <AgCharts
          options={currentWeekBarOptions as any}
          style={{ width: "100%", height: "100%" }}
        />
      </Box>

      {/* Leaderboard for Period */}
      <Flex width="100%" justifyContent="center" align="center">
        <SectionHeader>Leaderboard for Period</SectionHeader>
      </Flex>
      <Box borderRadius="2xl" shadow="xl" overflow="hidden" height="500px">
        <AgCharts
          options={leaderboardBarOptions as any}
          style={{ width: "100%", height: "100%" }}
        />
      </Box>
    </VStack>
  );
};

export default ManagingPartnersDashboard;
