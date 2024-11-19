"use client";

import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { Box, VStack, Heading, Grid as ChakraGrid } from "@chakra-ui/react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-charts-enterprise";
import {
  ColDef,
  GridReadyEvent,
  CreateCrossFilterChartParams,
  FirstDataRenderedEvent,
} from "ag-grid-community";

// Define the data type for rows
interface RowData {
  user: string;
  customer: string;
  site: string;
  team: string;
  department: string;
  score: number;
  createdDate: string;
  comments: string;
}

const Dashboard: React.FC = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);

  useEffect(() => {
    // Mock data for demonstration
    const data: RowData[] = [
      {
        user: "John Doe",
        customer: "ABC Ltd",
        site: "London HQ",
        team: "Team A",
        department: "Sales",
        score: 8,
        createdDate: "2024-11-12",
        comments: "Feeling good!",
      },
      {
        user: "Jane Smith",
        customer: "XYZ Inc",
        site: "New York",
        team: "Team B",
        department: "Marketing",
        score: 6,
        createdDate: "2024-11-12",
        comments: "Busy week.",
      },
      // Add more rows...
    ];
    setRowData(data);
  }, []);

  // Define column definitions with proper typing
  const columnDefs: ColDef[] = [
    { field: "user", sortable: true, filter: true },
    { field: "customer", sortable: true, filter: true },
    { field: "site", sortable: true, filter: true, chartDataType: "category" },
    { field: "team", sortable: true, filter: true },
    {
      field: "department",
      sortable: true,
      filter: true,
      chartDataType: "category",
    },
    { field: "score", sortable: true, filter: true, chartDataType: "series" },
    {
      field: "createdDate",
      sortable: true,
      filter: "agDateColumnFilter",
      chartDataType: "category",
    },
    { field: "comments", sortable: true, filter: true },
  ];

  const defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  };

  const onGridReady = (params: FirstDataRenderedEvent): void => {
    const gridApi = params.api;

    // Create charts as soon as the grid is ready
    const chartContainer1 = document.getElementById("chart1");
    const chartContainer2 = document.getElementById("chart2");
    const chartContainer3 = document.getElementById("chart3");

    if (chartContainer1) {
      gridApi.createCrossFilterChart({
        chartType: "bar", // Happiness by department
        cellRange: { columns: ["department", "score"] },
        chartContainer: chartContainer1,
        suppressChartRanges: true,
      } as CreateCrossFilterChartParams);
    }

    if (chartContainer2) {
      gridApi.createCrossFilterChart({
        chartType: "column", // Happiness by office
        cellRange: { columns: ["site", "score"] },
        chartContainer: chartContainer2,
        suppressChartRanges: true,
      } as CreateCrossFilterChartParams);
    }

    if (chartContainer3) {
      gridApi.createCrossFilterChart({
        chartType: "line", // Trends over the last 3 months
        cellRange: { columns: ["createdDate", "score"] },
        chartContainer: chartContainer3,
        suppressChartRanges: true,
      } as CreateCrossFilterChartParams);
    }
  };

  return (
    <VStack
      spacing={6}
      align="stretch"
      p={6}
      mt={"60px"}
      w={"full"}
      px={"120px"}
    >
      <Heading textAlign="center">Weekly Pulse Dashboard</Heading>

      <Box className="ag-theme-alpine" height="400px" width="100%">
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          defaultColDef={defaultColDef}
          enableCharts={true}
          enableRangeSelection={true}
          onFirstDataRendered={onGridReady}
        />
      </Box>

      <ChakraGrid templateColumns="repeat(2, 1fr)" gap={6} width="100%">
        <Box id="chart1" height="300px" border="1px solid white"></Box>
        <Box id="chart2" height="300px" border="1px solid white"></Box>
        <Box
          id="chart3"
          height="300px"
          gridColumn="span 2"
          border="1px solid white"
        ></Box>
      </ChakraGrid>
    </VStack>
  );
};

export default Dashboard;
