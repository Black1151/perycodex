"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-charts-enterprise";
import { ColDef } from "ag-grid-community";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import { SectionHeader } from "@/components/sectionHeader/SectionHeader";
import { useFetchClient } from "@/hooks/useFetchClient";
import { Info } from "@mui/icons-material";
import SurveyModal from "@/components/surveyjs/layout/default/SurveyModal";
import HappinessScoreRenderer from "@/components/agGrids/CellRenderers/HappinessScoreRenderer";
import HappinessDifferenceRenderer from "@/components/agGrids/CellRenderers/HappinessDifferenceRenderer";
import UserRenderer from "@/components/agGrids/CellRenderers/UserRenderer";

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
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

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
          console.log(response);
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
      field: "minHappinessScore",
      headerName: "Min Score",
      sortable: true,
      cellRenderer: HappinessScoreRenderer,
      filter: "agNumberColumnFilter",
      cellDataType: "number",
    },
    {
      field: "maxHappinessScore",
      headerName: "Max Score",
      sortable: true,
      cellRenderer: HappinessScoreRenderer,
      filter: "agNumberColumnFilter",
      cellDataType: "number",
    },
    {
      field: "totalEntries",
      headerName: "Submissions",
      sortable: true,
      filter: "agNumberColumnFilter",
      cellDataType: "number",
    },
    {
      field: "avgHappinessScore",
      headerName: "Average Happiness Score",
      sortable: true,
      cellRenderer: HappinessScoreRenderer,
      filter: "agNumberColumnFilter",
      cellDataType: "number",
    },
    {
      field: "stddevHappinessScore",
      headerName: "Std Dev",
      sortable: true,
      hide: true,
    },
    {
      field: "lastMonthHappinessScore",
      headerName: "Last Month Avg",
      sortable: true,
      cellRenderer: HappinessScoreRenderer,
      filter: "agNumberColumnFilter",
      cellDataType: "number",
    },
    {
      field: "currentRagStatus",
      headerName: "Difference",
      sortable: true,
      cellRenderer: HappinessDifferenceRenderer,
    },
  ];

  const defaultColDef: ColDef = {
    resizable: true,
    filter: true,
    suppressHeaderMenuButton: true,
  };

  return (
    <VStack align="stretch" w="full" spacing={8}>
      <SurveyModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onClose}
        showButtons={{ close: false, confirm: true }}
        title={"How to filter"}
        titleProps={{
          fontFamily: "Bonfire",
          fontSize: "2xl",
          fontWeight: "bold",
          color: "perygonPink",
        }}
        bodyContent={
          <>
            <Text mb={4}>To filter the dashboard:</Text>
            <Text as="ul" ml={4}>
              <li>
                Use the filter icon on column headers to find specific entries.
              </li>
              <li>Filtering will affect the dashboard charts below</li>
            </Text>
            <br />
            <Text mb={4}>
              The difference column indicates where the last months average has
              positively/negatively shifted compared to the previous 12 months
              average for an individual.
            </Text>
            <Text as="ul" ml={4}>
              <li>Purple: A lot happier</li>
              <li>Green: Normal happiness</li>
              <li>Amber: Slightly lower than their normal happiness</li>
              <li>Red: A lot lower than their normal happiness</li>
            </Text>
          </>
        }
      />
      {/* Grid Section */}
      <Box
        className="ag-theme-alpine ag-theme-perygon"
        width="100%"
        p={4}
        borderRadius="lg"
      >
        <Flex width="100%" justifyContent="center" mb={4}>
          <SectionHeader>
            Individuals Stats for previous 12 months{" "}
          </SectionHeader>
          <Tooltip label="Click to learn how to filter the dashboard" hasArrow>
            <IconButton
              aria-label="Filter Help"
              icon={<Info />}
              variant="ghost"
              onClick={onOpen}
              color={"white"}
              _hover={{ color: "perygonPink", background: "white" }}
              ml={2}
            />
          </Tooltip>
        </Flex>
        <DataGridComponent
          data={rowData}
          loading={isLoading}
          initialFields={columnDefs}
          showTopBar={true}
          defaultColDef={defaultColDef}
        />
      </Box>
    </VStack>
  );
};

export default RagDashboard;
