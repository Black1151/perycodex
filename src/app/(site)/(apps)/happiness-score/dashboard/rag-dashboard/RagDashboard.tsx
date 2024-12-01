"use client";

import React, { useState, useEffect } from "react";
import { Box, VStack, Flex } from "@chakra-ui/react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-charts-enterprise";
import { ColDef } from "ag-grid-community";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import { SectionHeader } from "@/components/sectionHeader/SectionHeader";
import { useFetchClient } from "@/hooks/useFetchClient";
import { useUser } from "@/providers/UserProvider";
import { useWorkflow } from "@/providers/WorkflowProvider";

interface ApiResponse {
  resource: RowData[]; // This matches the RowData type you're using
}

interface RowData {
  userId: number;
  fullName: string;
  deptName: string;
  teamName: string | null;
  siteName: string;
  avgHappinessScore: string;
  stddevHappinessScore: string;
  minHappinessScore: number;
  maxHappinessScore: number;
  totalEntries: number;
  lastMonthHappinessScore: string;
  currentRagStatus: string;
}

const RagDashboard: React.FC = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const { toolId, workflowId } = useWorkflow();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const { fetchClient } = useFetchClient();

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);

      try {
        const response = await fetchClient<ApiResponse>(
          "/api/happiness-graphs/getRagData",
          {
            method: "POST",
            body: {
              toolId: 1,
              workflowId: 1,
              customerId: 1,
            },
          },
        );

        if (response && response.resource) {
          setRowData(response.resource);
        } else {
          console.error("Invalid response:", response);
          setRowData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setRowData([]);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, []);

  const columnDefs: ColDef[] = [
    { field: "fullName", headerName: "User", sortable: true },
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
      field: "avgHappinessScore",
      headerName: "Average Happiness Score",
      sortable: true,
    },
    { field: "stddevHappinessScore", headerName: "Std Dev", sortable: true },
    { field: "minHappinessScore", headerName: "Min Score", sortable: true },
    { field: "maxHappinessScore", headerName: "Max Score", sortable: true },
    { field: "totalEntries", headerName: "Entries", sortable: true },
    {
      field: "lastMonthHappinessScore",
      headerName: "Last Month Avg",
      sortable: true,
    },
    { field: "currentRagStatus", headerName: "RAG Status", sortable: true },
  ];

  const defaultColDef: ColDef = {
    resizable: true,
    filter: true,
    suppressHeaderMenuButton: true,
  };

  return (
    <VStack align="stretch" w="full" spacing={8}>
      {/* Grid Section */}
      <Box
        className="ag-theme-alpine ag-theme-perygon"
        width="100%"
        p={4}
        borderRadius="lg"
      >
        <Flex width="100%" justifyContent="center" mb={4}>
          <SectionHeader>Data Grid</SectionHeader>
        </Flex>
        <DataGridComponent
          data={rowData}
          loading={isLoading}
          initialFields={columnDefs}
          showTopBar={false}
          defaultColDef={defaultColDef}
        />
      </Box>
    </VStack>
  );
};

export default RagDashboard;
