"use client";

import React, { useEffect, useState } from "react";
import { Box, Flex, VStack, Heading, Text } from "@chakra-ui/react";
import { useUser } from "@/providers/UserProvider";
import { useFetchClient } from "@/hooks/useFetchClient";
import { SectionHeader } from "@/components/sectionHeader/SectionHeader";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import UserRenderer from "@/components/agGrids/CellRenderers/UserRenderer";
import HappinessScoreRenderer from "@/components/agGrids/CellRenderers/HappinessScoreRenderer";
import CommentsCellRenderer from "@/components/agGrids/CellRenderers/CommentsCellRenderer";

interface ManagingPartnersResponse {
  resource: {
    totalAvg: any;
    gridData: any;
    weeklyLineChartComparisonData: any;
    monthlyLineChartComparisonData: any;
    currentWeekLeaderboard: any;
    leaderboardData: any;
  };
}

// Utility to safely parse data if it's a string
function parseData<T>(data: T[] | string): T[] {
  if (Array.isArray(data)) {
    return data;
  }
  try {
    return JSON.parse(data || "[]") as T[];
  } catch (error) {
    console.error("Error parsing data:", error);
    return [];
  }
}

const ManagingPartnersDashboard: React.FC = () => {
  const { fetchClient } = useFetchClient();
  const { user } = useUser();

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

  const getData = async () => {
    setIsLoading(true);
    try {
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

        setTotalAvg(parseData(resTotalAvg));
        setGridData(parseData(resGridData));
        setWeeklyLineChartComparisonData(parseData(resWeeklyData));
        setMonthlyLineChartComparisonData(parseData(resMonthlyData));
        setCurrentWeekLeaderboard(parseData(resWeekLeaderboard));
        setLeaderboardData(parseData(resLeaderboardData));
      } else {
        console.error("Invalid response:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getData();
    }
  }, [user]);

  return (
    <VStack align="stretch" spacing={6} w="full" p={4}>
      {isLoading && (
        <Box textAlign="center">
          <p>Loading...</p>
        </Box>
      )}

      {/*
        Below are example boxes (placeholders).
        Each Box is 400px high and half the screen wide (on md+).
        We’re just showing a slice of the data for demonstration.
      */}
      <Flex width="100%" justifyContent={"center"} align="center">
        <SectionHeader>Average</SectionHeader>
      </Flex>
      <Box
        w="100%"
        h="400px"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
        p={4}
        overflow="auto"
      >
        <Heading size="md" mb={2}>
          Total Avg (Sample)
        </Heading>
        <pre style={{ whiteSpace: "pre-wrap" }}>{totalAvg}</pre>
      </Box>

      {/*  Scores and Comments */}
      <Flex width="100%" justifyContent={"center"} align="center">
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

      <Flex width="100%" justifyContent={"center"} align="center">
        <SectionHeader>Weekly Comparison</SectionHeader>
      </Flex>
      <Box
        w="100%"
        h="400px"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
        p={4}
        overflow="auto"
      >
        <Heading size="md" mb={2}>
          Weekly Comparison (Sample)
        </Heading>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(weeklyLineChartComparisonData.slice(0, 5), null, 2)}
        </pre>
      </Box>

      <Flex width="100%" justifyContent={"center"} align="center">
        <SectionHeader>Monthly Comparison</SectionHeader>
      </Flex>
      <Box
        w="100%"
        h="400px"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
        p={4}
        overflow="auto"
      >
        <Heading size="md" mb={2}>
          Monthly Comparison (Sample)
        </Heading>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(monthlyLineChartComparisonData.slice(0, 5), null, 2)}
        </pre>
      </Box>

      <Flex width="100%" justifyContent={"center"} align="center">
        <SectionHeader>Current Week Leaderboard</SectionHeader>
      </Flex>
      <Box
        w="100%"
        h="400px"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
        p={4}
        overflow="auto"
      >
        <Heading size="md" mb={2}>
          Current Week Leaderboard (Sample)
        </Heading>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(currentWeekLeaderboard.slice(0, 5), null, 2)}
        </pre>
      </Box>

      <Flex width="100%" justifyContent={"center"} align="center">
        <SectionHeader>Leaderboard for Period</SectionHeader>
      </Flex>

      <Box
        w="100%"
        h="400px"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
        p={4}
        overflow="auto"
      >
        <Heading size="md" mb={2}>
          Leaderboard Data (Sample)
        </Heading>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(leaderboardData.slice(0, 5), null, 2)}
        </pre>
      </Box>
    </VStack>
  );
};

export default ManagingPartnersDashboard;
