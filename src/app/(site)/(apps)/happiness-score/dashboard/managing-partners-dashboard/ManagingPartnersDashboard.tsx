"use client";

import React, { useEffect, useState } from "react";
import { Box, Flex, useDisclosure, useTheme, VStack } from "@chakra-ui/react";
import { useFetchClient } from "@/hooks/useFetchClient";
import { SectionHeader } from "@/components/sectionHeader/SectionHeader";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import { ColDef } from "ag-grid-community";
import UserRenderer from "@/components/agGrids/CellRenderers/UserRenderer";
import HappinessScoreRenderer from "@/components/agGrids/CellRenderers/HappinessScoreRenderer";
import CommentsCellRenderer from "@/components/agGrids/CellRenderers/CommentsCellRenderer";
import { useUser } from "@/providers/UserProvider";
import SurveyModal from "@/components/surveyjs/layout/default/SurveyModal";

interface ApiResponse {
  resource: UserStatsResponse;
}

interface UserStatsResponse {
  currentWeekData?: CurrentWeekData[];
  currentWeekLeaderboard?: CurrentWeekLeaderboard[];
  eightWeekLeaderboard?: EightWeekLeaderboard[];
  eightWeekOfficeComparison?: EightWeekOfficeComparison[];
}

interface CurrentWeekData {
  fullName: string;
  siteName: string;
  departmentName: string;
  date: string; // ISO date string
  happinessScore: number;
  comments: string;
  userUniqueId?: string; // Optional if not always present
  userImageUrl?: string; // Optional if not always present
}

interface CurrentWeekLeaderboard {
  siteName: string;
  currentScore: number;
  currentSubmissions: number;
}

interface EightWeekLeaderboard {
  siteName: string;
  eightWeekScore: number;
  eightWeekSubmissions: number;
}

interface EightWeekOfficeComparison {
  week: string;
  siteScores: SiteScoresData[];
}

interface SiteScoresData {
  [key: string]: number;
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
  const [isLoading, setIsLoading] = useState(false);
  // Data State
  const [currentWeekRowData, setCurrentWeekRowData] = useState<
    CurrentWeekData[]
  >([]);

  const { user } = useUser();
  const { fetchClient } = useFetchClient();
  const theme = useTheme();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalData, setModalData] = useState<{
    title: string;
    body: string | React.ReactNode;
  }>({
    title: "",
    body: "",
  });

  const defaultColDef: ColDef = {
    resizable: true,
    filter: true,
    suppressHeaderMenuButton: true,
  };

  const currentWeekColDef: ColDef[] = [
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

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await fetchClient<ApiResponse>(
        "/api/happiness-graphs/getMpsData",
      );
      if (response && response.resource) {
        const {
          currentWeekData,
          currentWeekLeaderboard,
          eightWeekLeaderboard,
          eightWeekOfficeComparison,
        } = response.resource;

        setCurrentWeekRowData(
          currentWeekData ? parseData<CurrentWeekData>(currentWeekData) : [],
        );
      } else {
        console.error("No resource data in API response.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [user]);

  return (
    <>
      <SurveyModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onClose}
        showButtons={{ close: false, confirm: true }}
        title={modalData.title}
        titleProps={{
          fontFamily: "Bonfire",
          fontSize: "2xl",
          fontWeight: "bold",
          color: "perygonPink",
        }}
        bodyContent={modalData.body}
      />

      <VStack align="stretch" w="full" spacing={6} mb={3}>
        {/*Current Week Data*/}
        {currentWeekRowData.length > 0 && (
          <Box
            className="ag-theme-alpine ag-theme-perygon"
            width="100%"
            borderRadius="lg"
          >
            <Flex width="100%" justifyContent="center" mb={4}>
              <SectionHeader>
                {user?.fullName} stats for previous 12 months
              </SectionHeader>
            </Flex>
            <DataGridComponent
              data={currentWeekRowData}
              loading={isLoading}
              initialFields={currentWeekColDef}
              showTopBar={true}
              defaultColDef={defaultColDef}
              refreshData={getData}
              enableAutoRefresh={true}
            />
          </Box>
        )}
      </VStack>
    </>
  );
};

export default ManagingPartnersDashboard;
