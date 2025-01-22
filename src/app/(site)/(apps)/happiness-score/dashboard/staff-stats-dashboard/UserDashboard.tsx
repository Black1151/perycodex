"use client";

import React, {useEffect, useState} from "react";
import {
    Avatar,
    Box,
    Flex,
    IconButton,
    Text,
    Tooltip,
    useDisclosure,
    useTheme,
    VStack,
} from "@chakra-ui/react";
import {useFetchClient} from "@/hooks/useFetchClient";
import {CompanyHistogram} from "@/app/(site)/(apps)/happiness-score/dashboard/company-stats-dashboard/CompanyHistogram";
import {CompanyBubble} from "@/app/(site)/(apps)/happiness-score/dashboard/company-stats-dashboard/CompanyBubble";
import {AgCharts} from "ag-charts-react";
import {SectionHeader} from "@/components/sectionHeader/SectionHeader";
import DataGridComponentLight from "@/components/agGrids/DataGrid/DataGridComponentLight";
import {ColDef} from "ag-grid-community";
import HappinessScoreRenderer from "@/components/agGrids/CellRenderers/HappinessScoreRenderer";
import CommentsCellRenderer from "@/components/agGrids/CellRenderers/CommentsCellRenderer";
import {useUser} from "@/providers/UserProvider";
import {Info} from "@mui/icons-material";
import SurveyModal from "@/components/surveyjs/layout/default/SurveyModal";
import StaffHappinessDetailsRenderer
    from "@/components/agGrids/CellRenderers/HappinessScore/StaffHappinessDetailsRenderer";

// Define interfaces for each data type
interface UserScore {
    score: number;
    count: number;
}

interface UserDistributionItem {
    dayOfSubmission: string;
    score: number;
    countOfScore: number;
}

interface ComparativeItem {
    site: number;
    user: number;
    company: number;
    department: number;
    weekEnd: string;
    weekStart: string;
}

interface MonthlyComparativeItem {
    site: number;
    user: number;
    company: number;
    department: number;
    monthEnd: string;
    monthStart: string;
}

interface UserSubmissions {
    date: string;
    comments: string;
    happinessScore: number;
    fullName: string;
    userUniqueId: string;
    userImageUrl: string;
    siteName: string;
    departmentName: string;
}

interface UserStatsResponse {
    userScores: UserScore[];
    userDistribution: UserDistributionItem[];
    comparativeData: ComparativeItem[];
    monthlyComparativeData?: MonthlyComparativeItem[];
    userSubmissions: UserSubmissions[];
}

interface ApiResponse {
    resource: UserStatsResponse;
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

const UserDashboard: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [rowData, setRowData] = useState<UserSubmissions[]>([]);
    const [userScores, setUserScores] = useState<UserScore[]>([]);
    const [userDistribution, setUserDistribution] = useState<
        UserDistributionItem[]
    >([]);
    const [comparativeData, setComparativeData] = useState<ComparativeItem[]>([]);
    const [monthlyComparativeData, setMonthlyComparativeData] = useState<
        MonthlyComparativeItem[]
    >([]);

    const {user} = useUser();
    const {fetchClient} = useFetchClient();
    const theme = useTheme();
    const {isOpen, onOpen, onClose} = useDisclosure();
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

    const columnDefs: ColDef[] = [
        {
            headerName: "",
            field: "userImageUrl",
            sortable: false,
            filter: false,
            width: 100,
            maxWidth: 60,
            resizable: false,
            cellRenderer: StaffHappinessDetailsRenderer,
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
            sortable: true,
            filter: "agSetColumnFilter",
        },
        {
            field: "departmentName",
            headerName: "Department",
            sortable: true,
            filter: "agSetColumnFilter",
        },
        {
            field: "date",
            headerName: "Date",
            sortable: true,
            valueFormatter: (params) => {
                if (!params.value) return "";
                const date = new Date(params.value);
                return date.toLocaleDateString("en-UK", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                });
            },
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
                "/api/happiness-graphs/getUserStatsData"
            );

            if (response && response.resource) {
                const {
                    userSubmissions,
                    userScores,
                    userDistribution,
                    comparativeData,
                    monthlyComparativeData,
                } = response.resource;

                setRowData(parseData<UserSubmissions>(userSubmissions));
                setUserScores(parseData<UserScore>(userScores));
                setUserDistribution(parseData<UserDistributionItem>(userDistribution));
                setComparativeData(parseData<ComparativeItem>(comparativeData));
                setMonthlyComparativeData(
                    parseData<MonthlyComparativeItem>(monthlyComparativeData || [])
                );
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
        getData();
    }, [user]);

    const showPunchCardHelp = () => {
        setModalData({
            title: "What is a Punch Card?",
            body: (
                <>
                    <Text mb={4}>
                        A punch card visualization shows how frequently events occur over
                        time. In this context, each circle represents a specific day and the
                        size of the circle corresponds to the number of happiness scores
                        submitted on that day.
                    </Text>
                    <Text>
                        This helps you quickly identify patterns: for example, heavier usage
                        (larger circles) on certain days or dips in engagement on others.
                    </Text>
                </>
            ),
        });
        onOpen();
    };

    // Weekly line chart configuration
    const weeklyLineChartOptions = {
        data: comparativeData,
        series: [
            {
                type: "line",
                xKey: "weekEnd",
                yKey: "user",
                yName: "User",
                stroke: theme.colors.perygonPink,
                marker: {
                    enabled: true,
                    fill: theme.colors.perygonPink,
                },
                interpolation: {
                    type: "smooth",
                },
            },
            {
                type: "line",
                xKey: "weekEnd",
                yKey: "site",
                yName: "Site",
                marker: {enabled: true},
                interpolation: {
                    type: "smooth",
                },
            },
            {
                type: "line",
                xKey: "weekEnd",
                yKey: "department",
                yName: "Department",
                marker: {enabled: true},
                interpolation: {
                    type: "smooth",
                },
            },
            {
                type: "line",
                xKey: "weekEnd",
                yKey: "company",
                yName: "Company",
                marker: {enabled: true},
                interpolation: {
                    type: "smooth",
                },
            },
        ],
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
                    text: "Week End",
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

    // Monthly line chart configuration
    const monthlyLineChartOptions = {
        data: monthlyComparativeData,
        series: [
            {
                type: "line",
                xKey: "monthEnd",
                yKey: "user",
                yName: "User",
                stroke: theme.colors.perygonPink,
                marker: {enabled: true, fill: theme.colors.perygonPink},
                interpolation: {
                    type: "smooth",
                },
            },
            {
                type: "line",
                xKey: "monthEnd",
                yKey: "site",
                yName: "Site",
                marker: {enabled: true},
                interpolation: {
                    type: "smooth",
                },
            },
            {
                type: "line",
                xKey: "monthEnd",
                yKey: "department",
                yName: "Department",
                marker: {enabled: true},
                interpolation: {
                    type: "smooth",
                },
            },
            {
                type: "line",
                xKey: "monthEnd",
                yKey: "company",
                yName: "Company",
                marker: {enabled: true},
                interpolation: {
                    type: "smooth",
                },
            },
        ],
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
                    text: "Month End",
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
        contextMenu: {
            enabled: false,
        },
        zoom: {
            enabled: false,
        },
        navigator: {
            enabled: false,
        },
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

    return (
        <>
            <SurveyModal
                isOpen={isOpen}
                onClose={onClose}
                onConfirm={onClose}
                showButtons={{close: false, confirm: true}}
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
                {comparativeData.length > 0 && (
                    <Box
                        className="ag-theme-alpine"
                        width="100%"
                        borderRadius="lg"
                    >
                        <Flex width="100%" justifyContent="center" mb={4}>
                            <SectionHeader>
                                {user?.fullName} stats for previous 12 months
                            </SectionHeader>
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
                                refreshData={getData}
                                enableAutoRefresh={true}
                            />
                        </Box>
                    </Box>
                )}

                {/* Line Chart - Comparative Weekly Data */}
                {comparativeData.length > 0 && (
                    <>
                        <Flex width="100%" justifyContent={"center"}>
                            <SectionHeader>Weekly Trend</SectionHeader>
                        </Flex>
                        <Box
                            borderRadius="2xl"
                            shadow="xl"
                            overflow="hidden"
                            height="500px"
                        >
                            <AgCharts
                                options={weeklyLineChartOptions as any}
                                style={{width: "100%", height: "100%"}}
                            />
                        </Box>
                    </>
                )}

                {/* Line Chart - Comparative Monthly Data */}
                {monthlyComparativeData.length > 0 && (
                    <>
                        <Flex width="100%" justifyContent={"center"}>
                            <SectionHeader>Monthly Trend</SectionHeader>
                        </Flex>
                        <Box
                            borderRadius="2xl"
                            shadow="xl"
                            overflow="hidden"
                            height="500px"
                        >
                            <AgCharts
                                options={monthlyLineChartOptions as any}
                                style={{width: "100%", height: "100%"}}
                            />
                        </Box>
                    </>
                )}

                {/* Histogram - User Scores */}
                {userScores.length > 0 && (
                    <>
                        <Flex width="100%" justifyContent={"center"}>
                            <SectionHeader>Frequency of Scores</SectionHeader>
                        </Flex>
                        <Box borderRadius="2xl" shadow="xl" overflow="hidden">
                            <CompanyHistogram scoreDistribution={userScores}/>
                        </Box>
                    </>
                )}

                {/* Bubble Chart - User Distribution */}
                {userDistribution.length > 0 && (
                    <>
                        <Flex width="100%" justifyContent={"center"} align="center">
                            <SectionHeader>Punch Card</SectionHeader>
                            <Tooltip
                                label="Click to learn more about the Punch Card visualization"
                                hasArrow
                            >
                                <IconButton
                                    aria-label="Punch Card Help"
                                    icon={<Info/>}
                                    variant="ghost"
                                    onClick={showPunchCardHelp}
                                    color={"white"}
                                    _hover={{color: "perygonPink", background: "white"}}
                                    ml={2}
                                />
                            </Tooltip>
                        </Flex>
                        <Box
                            borderRadius="2xl"
                            shadow="xl"
                            overflow="hidden"
                            height="500px"
                        >
                            <CompanyBubble scores={userDistribution}/>
                        </Box>
                    </>
                )}
            </VStack>
        </>
    );
};

export default UserDashboard;
