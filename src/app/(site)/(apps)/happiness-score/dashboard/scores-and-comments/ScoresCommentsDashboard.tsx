"use client";

import React, {useEffect, useState} from "react";
import {
    Box,
    Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay,
    Text,
    useBreakpointValue,
    useTheme, VStack,
} from "@chakra-ui/react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-charts-enterprise";
import {
    ColDef,
    CreateCrossFilterChartParams, FirstDataRenderedEvent,
} from "ag-grid-community";
import DataGridComponentLight from "@/components/agGrids/DataGrid/DataGridComponentLight";
import FilterArea from "@/app/(site)/(apps)/happiness-score/dashboard/site-department-analysis/FilterArea";
import {useWorkflow} from "@/providers/WorkflowProvider";
import {useUser} from "@/providers/UserProvider";
import {addDays, endOfWeek, format, parseISO, startOfWeek} from "date-fns";
import {useFetchClient} from "@/hooks/useFetchClient";
import useColor from "@/hooks/useColor";
import {SectionHeader} from "@/components/sectionHeader/SectionHeader";
import {columnDefs} from "@/app/(site)/(apps)/happiness-score/dashboard/scores-and-comments/GridColumnDefs";
import {modalColDef} from "@/app/(site)/(apps)/happiness-score/dashboard/scores-and-comments/ModalColumnDefs";
import {AgNodeClickEvent} from "ag-charts-types";
import SubmissionsTooltipRenderer from "@/components/agCharts/SubmissionsTooltipRenderer";


interface ApiResponse {
    data: RowData[];
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

const ScoresCommentsDashboard: React.FC = () => {
        const isMobile = useBreakpointValue({base: true, sm: true, md: false});
        const theme = useTheme();
        const [gridData, setGridData] = useState<Record<string, any>[]>([]);
        const [loading, setLoading] = useState<boolean>(false);
        const [filterOptions, setFilterOptions] = useState<Record<string, any>>({});
        const {toolId, workflowId} = useWorkflow();
        const {fetchClient} = useFetchClient();
        const {user} = useUser();
        const {getColor} = useColor();

        // Details Modal for Clicking
        const [isBarModalOpen, setIsBarModalOpen] = useState(false);
        const [barModalTitle, setBarModalTitle] = useState("");
        const [filterModel, setFilterModel] = useState({});

        const defaultColDef: ColDef = {
            resizable: true,
            filter: false,
            sortable: false,
            flex: isMobile ? 0 : 1,
        };

        const modalDefaultColDef: ColDef = {
            resizable: true,
            sortable: true,
            flex: isMobile ? 0 : 1,
        };


        const getData = async (postBody: Record<string, any> = filterOptions) => {

            if (!toolId || !workflowId || !user?.customerId) {
                console.warn("Skipping getData call: Required data is missing.");
                return;
            }

            setLoading(true);
            try {
                const response = await fetchClient<ApiResponse>(
                    `/api/happiness-graphs/getAllHappinessData`,
                    {
                        method: 'POST',
                        body: {
                            toolId,
                            workflowId,
                            ...postBody
                        },
                        redirectOnError: false,
                    }
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

                    setGridData(processedData);
                } else {
                    console.error("Invalid response:", response);
                    setGridData([]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setGridData([]);
            } finally {
                setLoading(false);
            }
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
                                tooltip: {
                                    renderer: SubmissionsTooltipRenderer,
                                },
                                cornerRadius: 10,
                                shadow: {
                                    enabled: true,
                                    color: "#191919",
                                    xOffset: 1,
                                    yOffset: 1,
                                    blur: 4,
                                },
                                itemStyler: (params) => {
                                    const {datum, yKey} = params;
                                    const score = datum[yKey]; // Retrieve the score value
                                    const fillColor = getColor(score); // Determine color based on range

                                    return {
                                        fill: fillColor,
                                    };
                                },
                                listeners: {
                                    nodeClick: (params: AgNodeClickEvent<any, any>) => {
                                        const {xKey, datum} = params;

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
                                tooltip: {
                                    renderer: SubmissionsTooltipRenderer,
                                },
                                shadow: {
                                    enabled: true,
                                    color: "#191919",
                                    xOffset: 1,
                                    yOffset: 1,
                                    blur: 4,
                                },
                                itemStyler: (params) => {
                                    const {datum, yKey} = params;
                                    const score = datum[yKey];
                                    const fillColor = getColor(score);

                                    return {
                                        fill: fillColor,
                                    };
                                },
                                listeners: {
                                    nodeClick: (params: AgNodeClickEvent<any, any>) => {
                                        const {xKey, datum} = params;

                                        if (datum && xKey) {
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
                                        const {datum, yKey} = params;
                                        const score = datum[yKey]; // Retrieve the score value
                                        const fillColor = getColor(score); // Determine color based on range

                                        return {
                                            fill: fillColor,
                                            size: 10,
                                        };
                                    },
                                },
                                tooltip: {
                                    renderer: SubmissionsTooltipRenderer,
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
                                        const {datum, yKey} = params;
                                        const score = datum[yKey]; // Retrieve the score value
                                        const fillColor = getColor(score); // Determine color based on range

                                        return {
                                            fill: fillColor,
                                            size: 10,
                                        };
                                    },
                                },
                                tooltip: {
                                    renderer: SubmissionsTooltipRenderer,
                                },
                            },
                        },
                    },
                },
            ];

            chartConfigs.forEach((config) => {
                const container = document.getElementById(config.id) as HTMLElement;
                if (container) {
                    gridApi.createRangeChart({
                        ...config,
                        chartContainer: container,
                        suppressChartRanges: true,
                    });
                }
            });
        };

        const onFilterChange = (postBody: Record<string, any>) => {
            setFilterOptions(postBody);
            getData(postBody);
        }

        useEffect(() => {
            if (!toolId || !workflowId || !user?.customerId) {
                return; // Do nothing if the necessary data is not yet available
            }

            getData({
                startDate: startOfWeek(new Date(), {weekStartsOn: 1}),
                endDate: endOfWeek(new Date(), {weekStartsOn: 1}),
            });
        }, [toolId, workflowId, user]);


        return (

            <VStack align="stretch" spacing={6} w="full" py={4}>
                <FilterArea onApplyFilters={onFilterChange}
                            filterOptions={{
                                showDateFilter: true,
                                showSitesFilter: false,
                                showDepartmentsFilter: false
                            }}
                            defaultDateFilter={'currentWeek'}
                />

                <Modal
                    isOpen={isBarModalOpen}
                    onClose={() => setIsBarModalOpen(false)}
                    size="5xl"
                >
                    <ModalOverlay/>
                    <ModalContent bgGradient={theme.gradients.perygonBackground}>
                        <ModalHeader color="white">{barModalTitle}</ModalHeader>
                        <ModalCloseButton color="white"/>
                        <ModalBody pb={10}>
                            <VStack minHeight={520}>
                                <Box
                                    className="ag-theme-alpine"
                                    w="100%"
                                    p={1}
                                    pb="7px"
                                    borderRadius="xl"
                                    boxShadow="md"
                                    bgColor="white"
                                >
                                    <DataGridComponentLight
                                        data={gridData}
                                        initialFields={modalColDef}
                                        showTopBar={false}
                                        defaultColDef={modalDefaultColDef}
                                        filterModel={filterModel}
                                    />
                                </Box>
                            </VStack>
                        </ModalBody>
                    </ModalContent>
                </Modal>

                <Flex w={"100%"} gap={6} flexWrap={"wrap"} pb={4}>
                    <DataGridComponentLight
                        data={gridData}
                        loading={loading}
                        initialFields={columnDefs}
                        showTopBar={false}
                        defaultColDef={defaultColDef}
                        onGridReady={handleGridReady}
                        refreshData={getData}
                        enableAutoRefresh={true}
                        title={'Score and Comments'}

                    />

                    {gridData.length > 0 && (
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
                                <Flex width="100%" justifyContent="center" align="center" mb={4}>
                                    <SectionHeader>Happiness by Department</SectionHeader>
                                </Flex>
                                <Box
                                    id="chart1"
                                    height="400px"
                                    w="full"
                                    borderRadius={"2xl"}
                                ></Box>
                            </Box>
                            <Box
                                minW={["100%", "100%", "48%"]}
                                flex={1}
                                textAlign="center"
                                borderRadius="lg"
                            >
                                <Flex width="100%" justifyContent="center" align="center" mb={4}>
                                    <SectionHeader>Happiness by Office</SectionHeader>
                                </Flex>
                                <Box
                                    id="chart2"
                                    height="400px"
                                    w="full"
                                    borderRadius={"2xl"}
                                ></Box>
                            </Box>
                            <Box
                                minW={["100%", "100%", "100%"]}
                                flex={1}
                                textAlign="center"
                                borderRadius="lg"
                            >
                                <Flex width="100%" justifyContent="center" align="center" mb={4}>
                                    <SectionHeader>Historic Weekly Average</SectionHeader>
                                </Flex>
                                <Box
                                    id="chart3"
                                    height="400px"
                                    w="full"
                                    borderRadius={"2xl"}
                                ></Box>
                            </Box>
                            <Box
                                minW={["100%", "100%", "100%"]}
                                flex={1}
                                textAlign="center"
                                borderRadius="lg"
                            >
                                <Flex width="100%" justifyContent="center" align="center" mb={4}>
                                    <SectionHeader>Historic Monthly Average</SectionHeader>
                                </Flex>
                                <Box
                                    id="chart4"
                                    height="400px"
                                    w="full"
                                    borderRadius={"2xl"}
                                ></Box>
                            </Box>
                        </Flex>
                    )}
                </Flex>
            </VStack>
        )
    }
;
export default ScoresCommentsDashboard;
