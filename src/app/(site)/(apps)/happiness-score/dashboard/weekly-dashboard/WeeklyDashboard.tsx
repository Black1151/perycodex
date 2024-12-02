"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Text,
  Tooltip,
  useDisclosure,
  useTheme,
  VStack,
} from "@chakra-ui/react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-charts-enterprise";
import {
  ColDef,
  CreateCrossFilterChartParams,
  FirstDataRenderedEvent,
} from "ag-grid-community";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import { SectionHeader } from "@/components/sectionHeader/SectionHeader";
import { useFetchClient } from "@/hooks/useFetchClient";
import { AgNodeClickEvent } from "ag-charts-types";
import useColor from "@/hooks/useColor";
import HappinessScoreRenderer from "@/components/agGrids/CellRenderers/HappinessScoreRenderer";
import SurveyModal from "@/components/surveyjs/layout/default/SurveyModal";
import { Info } from "@mui/icons-material";

interface ApiResponse {
  data: RowData[]; // This matches the RowData type you're using
}

interface RowData {
  role: string;
  email: string;
  firstName: string;
  lastName: string;
  userId: number;
  fullName: string;
  employStartDate: string;
  userImageUrl: string;
  userIsActive: boolean;
  userUniqueId: string;
  customerId: number;
  customerName: string;
  companyNo: string;
  customerCode: string;
  customerType: string;
  customerParentName: string | null;
  customerParentId: number | null;
  companySizeId: number;
  companySizeName: string;
  customerIsActive: boolean;
  businessTypeName: string;
  businessTypeId: number;
  siteName: string;
  siteId: number;
  teamName: string;
  teamId: number;
  jobLevelName: string;
  jobLevelId: number;
  deptName: string;
  deptId: number;
  regionName: string;
  regionId: number;
  sectorName: string;
  sectorId: number;
  contractTypeName: string;
  contractTypeId: number;
  multiSite: boolean;
  noOfSites: number;
  noOfUsers: number;
  numberOfEmployees: number;
  webAddress: string;
  remoteWorker: boolean;
  jsonBpRespFull: string;
  jsonBpRespLite: string;
  createdAt: string;
  createdBy: number;
  toolConfigId: number;
  workflowId: number;
  businessProcessId: number;
  workflowInstanceId: number;
  businessProcessInstanceId: number;
  userTags?: Tag[];
  siteTags?: Tag[];
  customerTags?: Tag[];
  eowDate?: string;
  monthYear?: string;
}

interface Tag {
  tagId: number;
  name: string;
}

interface SeduloCrossFilterChartParams extends CreateCrossFilterChartParams {
  id: string;
}

const WeeklyDashboard: React.FC = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const { getColor } = useColor();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { fetchClient } = useFetchClient();

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);

      try {
        // Call fetchClient with the expected ApiResponse type
        const response = await fetchClient<ApiResponse>(
          "/api/happiness-graphs/getCurrentWeekHappinessData?toolId=1&wfId=1",
        );

        if (response && response.data.length > 0) {
          setRowData(response.data); // Use the typed response data
        } else {
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
  }, []); // Empty dependency array ensures the effect runs only on mount

  const columnDefs: ColDef[] = [
    { field: "fullName", headerName: "User", filter: "agSetColumnFilter" },
    {
      field: "siteName",
      headerName: "Site",
      filter: "agSetColumnFilter",
      chartDataType: "category",
    },
    {
      field: "deptName",
      headerName: "Department",
      sort: "asc",
      filter: "agSetColumnFilter",
      chartDataType: "category",
    },
    {
      field: "happinessScore",
      headerName: "Happiness Score",
      chartDataType: "series",
      filter: "agSetColumnFilter",
      sortable: true,
      cellRenderer: HappinessScoreRenderer,
    },
    {
      field: "comments",
      headerName: "Comments",
      filter: "agSetColumnFilter",
      flex: 3,
    },
  ];

  const defaultColDef: ColDef = {
    resizable: true,
    filter: false,
    sortable: false,
    suppressHeaderMenuButton: true,
  };

  const handleGridReady = (params: FirstDataRenderedEvent) => {
    const gridApi = params.api;

    const chartConfigs: SeduloCrossFilterChartParams[] = [
      {
        id: "chart1",
        cellRange: {
          columns: ["deptName", "happinessScore"],
        },
        chartType: "bar",
        aggFunc: "avg",
        chartThemeOverrides: {
          common: {
            padding: {
              top: 20,
              left: 20,
              right: 20,
              bottom: 20,
            },
            contextMenu: {
              enabled: false,
            },
            axes: {
              category: {
                label: {
                  rotation: 340,
                  fontSize: 10,
                  fontFamily: "Metropolis",
                  color: theme.colors.perygonPink,
                },
                gridLine: {
                  width: 0,
                },
                crosshair: {
                  enabled: false,
                },
              },
              number: {
                crosshair: {
                  enabled: false,
                },
              },
            },
            legend: {
              enabled: false,
            },
            zoom: {
              enabled: false,
            },
            navigator: {
              enabled: false,
            },
            overlays: {
              noData: {
                text: "NO DATA",
              },
              loading: {
                text: "Loading...",
              },
            },
          },
          bar: {
            series: {
              cornerRadius: 10,
              shadow: {
                enabled: true,
                color: "#191919",
                xOffset: 1,
                yOffset: 1,
                blur: 4,
              },
              itemStyler: (params) => {
                const { datum, yKey } = params;
                const score = datum[yKey]; // Retrieve the score value
                const fillColor = getColor(score); // Determine color based on range

                return {
                  fill: fillColor,
                };
              },
              listeners: {
                nodeClick: (params: AgNodeClickEvent<any, any>) => {
                  const { datum, xKey, yKey } = params;
                  console.log("Node clicked:", params);

                  if (xKey && yKey && datum) {
                    const xValue = datum[xKey];
                    const yValue = datum[yKey];

                    console.log("X Value:", xValue);
                    console.log("Y Value:", yValue);

                    alert(`Clicked on ${xValue} with value ${yValue}`);
                  } else {
                    console.error("Invalid xKey, yKey, or datum:", {
                      xKey,
                      yKey,
                      datum,
                    });
                  }
                },
              },
            },
          },
        },
      },
      {
        id: "chart2",
        cellRange: {
          columns: ["siteName", "happinessScore"],
        },
        chartType: "column",
        aggFunc: "avg",
        chartThemeOverrides: {
          common: {
            padding: {
              top: 20,
              left: 20,
              right: 20,
              bottom: 20,
            },
            contextMenu: {
              enabled: false,
            },
            axes: {
              category: {
                label: {
                  rotation: 300,
                  fontSize: 10,
                  fontFamily: "Metropolis",
                  color: theme.colors.perygonPink,
                },
                gridLine: {
                  width: 0,
                },
                crosshair: {
                  enabled: false,
                },
              },
              number: {
                crosshair: {
                  enabled: false,
                },
              },
            },
            legend: {
              enabled: false,
            },
            zoom: {
              enabled: false,
            },
            navigator: {
              enabled: false,
            },
            overlays: {
              noData: {
                text: "NO DATA",
              },
              loading: {
                text: "Loading...",
              },
            },
          },
          bar: {
            series: {
              cornerRadius: 10,
              shadow: {
                enabled: true,
                color: "#191919",
                xOffset: 1,
                yOffset: 1,
                blur: 4,
              },
              itemStyler: (params) => {
                const { datum, yKey } = params;
                const score = datum[yKey]; // Retrieve the score value
                const fillColor = getColor(score); // Determine color based on range

                return {
                  fill: fillColor,
                };
              },
              listeners: {
                nodeClick: (params: AgNodeClickEvent<any, any>) => {
                  const { datum, xKey, yKey } = params;
                  console.log("Node clicked:", params);

                  if (xKey && yKey && datum) {
                    const xValue = datum[xKey];
                    const yValue = datum[yKey];

                    console.log("X Value:", xValue);
                    console.log("Y Value:", yValue);

                    alert(`Clicked on ${xValue} with value ${yValue}`);
                  } else {
                    console.error("Invalid xKey, yKey, or datum:", {
                      xKey,
                      yKey,
                      datum,
                    });
                  }
                },
              },
            },
          },
        },
      },
    ];

    chartConfigs.forEach((config) => {
      const container = document.getElementById(config.id);
      if (container) {
        gridApi.createRangeChart({
          ...config,
          chartContainer: container,
          suppressChartRanges: true,
        });
      }
    });
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
          <SectionHeader>Submissions</SectionHeader>
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
          showTopBar={false}
          defaultColDef={defaultColDef}
          onGridReady={handleGridReady}
        />
      </Box>

      {/* Chart Section */}
      <Flex
        width="100%"
        flexWrap="wrap"
        gap={6}
        justify="space-between"
        flex={1}
      >
        <Box
          minW={["100%", "100%", "48%"]}
          flex={1}
          textAlign="center"
          borderRadius="lg"
        >
          <Flex width="100%" justifyContent="center" mb={4}>
            <SectionHeader>Happiness by Department</SectionHeader>
          </Flex>
          <Box
            id="chart1"
            height="400px"
            w="full"
            // bg={"white"}
            borderRadius={"2xl"}
            overflow={"hidden"}
          ></Box>
        </Box>
        <Box
          minW={["100%", "100%", "48%"]}
          flex={1}
          textAlign="center"
          borderRadius="lg"
        >
          <Flex width="100%" justifyContent="center" mb={4}>
            <SectionHeader>Happiness by Office</SectionHeader>
          </Flex>
          <Box
            id="chart2"
            height="400px"
            w="full"
            // bg={"white"}
            borderRadius={"2xl"}
            overflow={"hidden"}
          ></Box>
        </Box>
      </Flex>
    </VStack>
  );
};

export default WeeklyDashboard;
