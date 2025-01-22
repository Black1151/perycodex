"use client";

import React, {useEffect, useState} from "react";
import {
    Avatar,
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
import DataGridComponentLight from "@/components/agGrids/DataGrid/DataGridComponentLight";
import {SectionHeader} from "@/components/sectionHeader/SectionHeader";
import {useFetchClient} from "@/hooks/useFetchClient";
import {AgNodeClickEvent} from "ag-charts-types";
import useColor from "@/hooks/useColor";
import HappinessScoreRenderer from "@/components/agGrids/CellRenderers/HappinessScoreRenderer";
import SurveyModal from "@/components/surveyjs/layout/default/SurveyModal";
import {Info} from "@mui/icons-material";
import UserRenderer from "@/components/agGrids/CellRenderers/UserRenderer";
import CommentsCellRenderer from "@/components/agGrids/CellRenderers/CommentsCellRenderer";
import {useWorkflow} from "@/providers/WorkflowProvider";
import {useUser} from "@/providers/UserProvider";

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
    const {getColor} = useColor();
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const isMobile = useBreakpointValue({base: true, sm: true, md: false});
    const {toolId, workflowId} = useWorkflow();
    const {user} = useUser();

    // Details Modal for Clicking
    const [isBarModalOpen, setIsBarModalOpen] = useState(false);
    const [barModalTitle, setBarModalTitle] = useState("");
    const [filterModel, setFilterModel] = useState({});

    const {fetchClient} = useFetchClient();

    const getData = async () => {
        setIsLoading(true);

        if (!toolId || !workflowId || !user?.customerId) {
            console.warn(
                "Required data (toolId, workflowId, or customerId) is missing",
            );
            return; // Prevent fetching if values are not ready
        }

        try {
            // Call fetchClient with the expected ApiResponse type
            const response = await fetchClient<ApiResponse>(
                `/api/happiness-graphs/getCurrentWeekHappinessData?toolId=${toolId}&wfId=${workflowId}&customerId=${user.customerId}`,
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

    useEffect(() => {
        // Fetch data only when toolId, workflowId, and user.customerId are available
        if (toolId && workflowId && user?.customerId) {
            getData();
        }
    }, [toolId, workflowId, user?.customerId]);

    const modalColDef: ColDef[] = [
        {
            headerName: "",
            field: "userImageUrl",
            sortable: false,
            filter: false,
            width: 100,
            maxWidth: 60,
            resizable: false,
            cellRenderer: (params: any) => {
                return (
                    <Flex
                        justifyContent="center"
                        alignItems="center"
                        w="100%"
                        h="100%"
                        py={1}
                    >
                        <Avatar
                            name={params.data.fullName}
                            src={params.data.userImageUrl}
                            size="sm"
                            sx={{
                                fontSize: "0.65rem",
                            }}
                        />
                    </Flex>
                );
            },
            cellStyle: {color: "black"},
        },
        {
            headerName: "Name",
            field: "fullName",
            sortable: true,
            filter: true,
            flex: 1,
            cellStyle: {color: "black"},
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

    const modalDefaultColDef: ColDef = {
        resizable: true,
        filter: true,
        sortable: true,
        suppressHeaderMenuButton: true,
    };

    const columnDefs: ColDef[] = [
        {
            headerName: "",
            field: "userImageUrl",
            sortable: false,
            filter: false,
            width: 100,
            maxWidth: 60,
            resizable: false,
            cellRenderer: (params: any) => {
                return (
                    <Flex
                        justifyContent="center"
                        alignItems="center"
                        w="100%"
                        h="100%"
                        py={1}
                    >
                        <Avatar
                            name={params.data.fullName}
                            src={params.data.userImageUrl}
                            size="sm"
                            sx={{
                                fontSize: "0.65rem",
                            }}
                        />
                    </Flex>
                );
            },
            cellStyle: {color: "black"},
        },
        {
            headerName: "Name",
            field: "fullName",
            sortable: true,
            filter: true,
            flex: 1,
            cellStyle: {color: "black"},
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
        filter: true,
        sortable: true,
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
        <VStack align="stretch" w="full" spacing={6} mb={3}>
            <SurveyModal
                isOpen={isOpen}
                onClose={onClose}
                onConfirm={onClose}
                showButtons={{close: false, confirm: true}}
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
                                data={rowData}
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
            {/* Grid Section */}
            <Box
                className="ag-theme-alpine"
                width="100%"
                borderRadius="lg"
            >
                <Flex width="100%" justifyContent={"center"} mb={2}>
                    <SectionHeader>Submissions</SectionHeader>
                    <Tooltip label="Click to learn how to filter the dashboard" hasArrow>
                        <IconButton
                            aria-label="Filter Help"
                            icon={<Info/>}
                            variant="ghost"
                            onClick={onOpen}
                            color={"white"}
                            _hover={{color: "perygonPink", background: "white"}}
                            ml={2}
                        />
                    </Tooltip>
                </Flex>
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
                            // bg={"white"}
                            borderRadius={"2xl"}
                            overflow={"hidden"}
                        ></Box>
                    </Box>
                </Flex>
            )}
        </VStack>
    );
};

export default WeeklyDashboard;
