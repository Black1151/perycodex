"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useBreakpointValue,
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
import { addDays, format, parseISO } from "date-fns";
import {
  AgCartesianSeriesTooltipRendererParams,
  AgNodeClickEvent,
} from "ag-charts-types";
import useColor from "@/hooks/useColor";
import HappinessScoreRenderer from "@/components/agGrids/CellRenderers/HappinessScoreRenderer";
import { Info } from "@mui/icons-material";
import SurveyModal from "@/components/surveyjs/layout/default/SurveyModal";
import UserRenderer from "@/components/agGrids/CellRenderers/UserRenderer";
import CommentsCellRenderer from "@/components/agGrids/CellRenderers/CommentsCellRenderer";
import { useWorkflow } from "@/providers/WorkflowProvider";
import { useUser } from "@/providers/UserProvider";

interface ApiResponse {
  data: RowData[]; // This matches the RowData type you're using
}

interface RowData {
  role: string;
  userId: number;
  fullName: string;
  userImageUrl: string;
  userIsActive: boolean;
  userUniqueId: string;
  customerId: number;
  customerIsActive: boolean;
  siteName: string;
  siteId: number;
  teamName: string;
  teamId: number;
  deptName: string;
  deptId: number;
  happinessScore: number;
  comments: string;
  createdAt: string;
  createdBy: number;
  toolConfigId: number;
  workflowId: number;
  businessProcessId: number;
  workflowInstanceId: number;
  businessProcessInstanceId: number;
  eowDate?: string;
  monthYear?: string;
}

interface SeduloCrossFilterChartParams extends CreateCrossFilterChartParams {
  id: string;
}

const Dashboard: React.FC = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const theme = useTheme();
  const { getColor } = useColor();
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, sm: true, md: false });
  const { toolId, workflowId } = useWorkflow();
  const { user } = useUser();

  // Details Modal for Clicking
  const [isBarModalOpen, setIsBarModalOpen] = useState(false);
  const [barModalTitle, setBarModalTitle] = useState("");
  const [filterModel, setFilterModel] = useState({});

  const { fetchClient } = useFetchClient();

  const getData = async () => {
    setIsLoading(true);

    try {
      // Ensure user and customerId exist before making the request
      if (!user || !user.customerId) {
        throw new Error("User or customerId is missing");
      }

      const response = await fetchClient<ApiResponse>(
        `/api/happiness-graphs/getAllHappinessData?toolId=${toolId}&wfId=${workflowId}&customerId=${user.customerId}`,
      );

      if (response && typeof response === "object" && "data" in response) {
        // Preprocess data to include the EOW date
        const processedData = response.data.map((item: RowData) => {
          const createdAtDate = parseISO(item.createdAt);
          const dayOfWeek = createdAtDate.getDay(); // 0 = Sunday, 1 = Monday, ...
          const eowDate = addDays(createdAtDate, 7 - dayOfWeek); // Move to next Sunday
          return {
            ...item,
            eowDate: format(eowDate, "yyyy-MM-dd"), // Format as "YYYY-MM-DD"
            monthYear: format(createdAtDate, "MM-yyyy"), // Format as "MM-YYYY"
          };
        });

        setRowData(processedData);
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

  useEffect(() => {
    getData();
  }, []);

  const columnDefs: ColDef[] = [
    {
      field: "fullName",
      headerName: "Name",
      cellRenderer: UserRenderer,
      cellRendererParams: {
        uniqueIdField: "userUniqueId",
        nameField: "fullName",
        imageUrlField: "userImageUrl",
      },
    },
    {
      field: "siteName",
      headerName: "Site",
      filter: "agMultiColumnFilter",
      chartDataType: "category",
    },
    {
      field: "deptName",
      headerName: "Department",
      filter: "agMultiColumnFilter",
      chartDataType: "category",
    },
    {
      field: "eowDate",
      headerName: "Week",
      sort: "asc",
      chartDataType: "category",
    },
    {
      field: "monthYear",
      headerName: "Month - Year",
      chartDataType: "category",
    },
    {
      field: "happinessScore",
      headerName: "Happiness Score",
      chartDataType: "series",
      cellRenderer: HappinessScoreRenderer,
    },
    {
      field: "comments",
      headerName: "Comments",
      cellRenderer: CommentsCellRenderer,
    },
  ];

  const modalColDef: ColDef[] = [
    {
      field: "fullName",
      headerName: "Name",
      cellRenderer: UserRenderer,
      cellRendererParams: {
        uniqueIdField: "userUniqueId",
        nameField: "fullName",
        imageUrlField: "userImageUrl",
      },
    },
    {
      field: "deptName",
      headerName: "Department",
      filter: "agMultiColumnFilter",
      chartDataType: "category",
    },
    {
      field: "siteName",
      headerName: "Site",
      filter: "agMultiColumnFilter",
      chartDataType: "category",
    },
    {
      field: "eowDate",
      headerName: "Week",
      sort: "asc",
      chartDataType: "category",
    },
    {
      field: "monthYear",
      headerName: "Month - Year",
      chartDataType: "category",
    },
    {
      field: "happinessScore",
      headerName: "Happiness Score",
      chartDataType: "series",
      cellRenderer: HappinessScoreRenderer,
    },
    {
      field: "comments",
      headerName: "Comments",
      cellRenderer: CommentsCellRenderer,
    },
  ];

  const defaultColDef: ColDef = {
    resizable: true,
    filter: false,
    sortable: false,
    flex: isMobile ? 0 : 1,
    suppressHeaderMenuButton: true,
  };

  const modalDefaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    flex: isMobile ? 0 : 1,
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
                  const { xKey, datum } = params;

                  if (datum && xKey) {
                    // Ensure `datum[xKey]` is processed correctly
                    const value =
                      typeof datum[xKey] === "object"
                        ? datum[xKey]?.value
                        : datum[xKey];

                    const newFilterModel = {
                      [xKey]: {
                        filterType: "multi",
                        filterModels: [
                          null,
                          {
                            values: value ? [value] : [], // Extract the value or use an empty array
                            filterType: "set",
                          },
                        ],
                      },
                    };
                    setBarModalTitle(`Department: ${value}`);
                    setFilterModel(newFilterModel);
                    setIsBarModalOpen(true);
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
                  const { xKey, datum } = params;

                  if (datum && xKey) {
                    // Ensure `datum[xKey]` is processed correctly
                    const value =
                      typeof datum[xKey] === "object"
                        ? datum[xKey]?.value
                        : datum[xKey];

                    const newFilterModel = {
                      [xKey]: {
                        filterType: "multi",
                        filterModels: [
                          null,
                          {
                            values: value ? [value] : [], // Extract the value or use an empty array
                            filterType: "set",
                          },
                        ],
                      },
                    };
                    setBarModalTitle(`Site: ${value}`);
                    setFilterModel(newFilterModel);
                    setIsBarModalOpen(true);
                  }
                },
              },
            },
          },
        },
      },
      {
        id: "chart3",
        cellRange: {
          columns: ["eowDate", "happinessScore"],
        },
        chartType: "line",
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
          line: {
            series: {
              stroke: theme.colors.perygonPink,
              interpolation: {
                type: "smooth",
              },
              marker: {
                enabled: true,
                itemStyler: (params) => {
                  const { datum, yKey } = params;
                  const score = datum[yKey]; // Retrieve the score value
                  const fillColor = getColor(score); // Determine color based on range

                  return {
                    fill: fillColor,
                    size: 10,
                  };
                },
              },
              tooltip: {
                renderer: renderer,
              },
            },
          },
        },
      },
      {
        id: "chart4",
        cellRange: {
          columns: ["monthYear", "happinessScore"],
        },
        chartType: "line",
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
          line: {
            series: {
              stroke: theme.colors.perygonPink,
              interpolation: {
                type: "smooth",
              },
              marker: {
                enabled: true,
                itemStyler: (params) => {
                  const { datum, yKey } = params;
                  const score = datum[yKey]; // Retrieve the score value
                  const fillColor = getColor(score); // Determine color based on range

                  return {
                    fill: fillColor,
                    size: 10,
                  };
                },
              },
              tooltip: {
                renderer: renderer,
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

  const renderer = (params: AgCartesianSeriesTooltipRendererParams) => {
    return (
      '<div class="ag-chart-tooltip-title" style="background-color:' +
      params.color +
      '">' +
      params.datum[params.xKey] +
      "</div>" +
      '<div class="ag-chart-tooltip-content">' +
      params.datum[params.yKey].toFixed(2) +
      "</div>"
    );
  };

  return (
    <VStack align="stretch" w="full" spacing={6} mb={3}>
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

      <Modal
        isOpen={isBarModalOpen}
        onClose={() => setIsBarModalOpen(false)}
        size="5xl"
      >
        <ModalOverlay />
        <ModalContent bgGradient={theme.gradients.perygonBackground}>
          <ModalHeader color="white">{barModalTitle}</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody pb={10}>
            <VStack minHeight={520}>
              <DataGridComponent
                data={rowData}
                initialFields={modalColDef}
                showTopBar={false}
                defaultColDef={modalDefaultColDef}
                filterModel={filterModel}
              />
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Grid Section */}
      <Box
        className="ag-theme-alpine ag-theme-perygon"
        width="100%"
        borderRadius="lg"
      >
        <Flex width="100%" justifyContent={"center"} mb={2}>
          <SectionHeader>All Submissions</SectionHeader>
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
          onGridReady={handleGridReady}
          refreshData={getData}
          enableAutoRefresh={true}
        />
      </Box>

      {rowData.length > 0 && (
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
            <Flex
              width="100%"
              justifyContent={isMobile ? "flex-start" : "center"}
              mb={2}
            >
              <SectionHeader>Happiness by Department</SectionHeader>
            </Flex>
            <Box
              id="chart1"
              height="400px"
              w="full"
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
            <Flex
              width="100%"
              justifyContent={isMobile ? "flex-start" : "center"}
              mb={2}
            >
              <SectionHeader>Happiness by Office</SectionHeader>
            </Flex>
            <Box
              id="chart2"
              height="400px"
              w="full"
              borderRadius={"2xl"}
              overflow={"hidden"}
            ></Box>
          </Box>
          <Box
            minW={["100%", "100%", "100%"]}
            flex={1}
            textAlign="center"
            borderRadius="lg"
          >
            <Flex
              width="100%"
              justifyContent={isMobile ? "flex-start" : "center"}
              mb={2}
            >
              <SectionHeader>Historic Weekly Average</SectionHeader>
            </Flex>
            <Box
              id="chart3"
              height="400px"
              w="full"
              borderRadius={"2xl"}
              overflow={"hidden"}
            ></Box>
          </Box>
          <Box
            minW={["100%", "100%", "100%"]}
            flex={1}
            textAlign="center"
            borderRadius="lg"
          >
            <Flex
              width="100%"
              justifyContent={isMobile ? "flex-start" : "center"}
              mb={2}
            >
              <SectionHeader>Historic Monthly Average</SectionHeader>
            </Flex>
            <Box
              id="chart4"
              height="400px"
              w="full"
              borderRadius={"2xl"}
              overflow={"hidden"}
            ></Box>
          </Box>
        </Flex>
      )}
    </VStack>
  );
};
export default Dashboard;
