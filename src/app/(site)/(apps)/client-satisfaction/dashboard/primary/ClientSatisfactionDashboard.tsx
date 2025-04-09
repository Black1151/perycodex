'use client';
import React, { useState, useEffect } from "react";
import FilterSidebar from "@/components/Sidebars/Dashboards Filter/FilterSidebar";
import AgChartComponent from "@/components/agCharts/AgChartComponent";
import AgGaugeComponent from "@/components/agCharts/AgGaugeComponent";
import { Flex, VStack, Box, Text } from "@chakra-ui/react";
import { useTheme } from "@chakra-ui/react";
import { dateRangeOptions } from "@/components/Sidebars/Dashboards Filter/dateRangeUtils";
import { ScoreTooltipRenderer } from "@/components/agCharts/tooltips/ScoreTooltipRenderer";
import { staffCommentsColumnDefs } from "./StaffGridColumnDefs";
import { serviceCommentsColumnDefs } from "./ServiceGridColumnDefs";
import { AgRadialGaugeOptions } from "ag-charts-community";
import { GridApi, FirstDataRenderedEvent } from "ag-grid-charts-enterprise";
import DataGridComponentLight from "@/components/agGrids/DataGrid/DataGridComponentLight";
import PerygonCard from "@/components/layout/PerygonCard";
import { SectionHeader } from "@/components/sectionHeader/SectionHeader";
import { set } from "lodash";

interface clientSatisfactionDashboardResponse {
    resource: {
        kpi: kpiData;
        nps: npsScore[];
        topStaff: staffRating[];
        bottomStaff: staffRating[];
        staff: {
            staffAvgRating: staffRating[];
            staffComments: staffComment[];
        };
        service: {
            serviceAvgRating: serviceRating[];
            serviceComments: serviceComment[];
        }
        companyComments: companyComment[];
        feedbackCount: {
            feedbackCount: number;
            feedbackCountChangePercent: number; // Change from previous period (%) (negative for decrease)
        };
    };
}

interface kpiData {
    avgStaffRating: number;
    avgServiceRating: number;
    avgOverallRating: number;
    nps: number;
}

interface npsScore {
    score: number;
    detractors: number;
    passives: number;
    promoters: number;
    totalResponses: number;
    monthYear: string;
}

interface staffRating {
    staffId: string;
    staffName: string;
    positiveCount: number;
    neutralCount: number;
    negativeCount: number;
    avgRating: number;
}

interface staffComment {
    staffId: string;
    staffName: string;
    comment: string;
    site: string;
    date: string;
    clientId: string;
    clientName: string;
    rating: number;
}

interface serviceRating {
    serviceId: string;
    serviceName: string;
    positiveCount: number;
    neutralCount: number;
    negativeCount: number;
    avgRating: number;
    monthYear: string;
}

interface serviceComment {
    serviceId: string;
    serviceName: string;
    comment: string;
    site: string;
    date: string;
    clientId: string;
    clientName: string;
    rating: number;
}

interface npsData {
    scores: npsScore[];
}

interface companyComment {
    comment: string;
    site: string;
    date: string;
    clientId: string;
    clientName: string;
    rating: number;
}

const ClientSatisfactionDashboard = () => {
    const [filterOptions, setFilterOptions] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [kpiData, setKpiData] = useState<kpiData>();
    const [npsData, setNpsData] = useState<npsData>();
    const [staffData, setStaffData] = useState<staffRating[] | null>(null);
    const [serviceData, setServiceData] = useState<serviceRating[] | null>(null);
    const [companyComments, setCompanyComments] = useState<companyComment[] | null>(null);
    const theme = useTheme();
    const [topStaff, setTopStaff] = useState<staffRating[] | null>(null);
    const [bottomStaff, setBottomStaff] = useState<staffRating[] | null>(null);
    const [staffComments, setStaffComments] = useState<staffComment[] | null>(null);
    const [serviceComments, setServiceComments] = useState<serviceComment[] | null>(null);
    const [staffCommentsGridData, setStaffCommentsGridData] = useState<Record<string, any>[]>([]);
    const [serviceCommentsGridData, setServiceCommentsGridData] = useState<Record<string, any>[]>([]);
    const [feedbackCount, setFeedbackCount] = useState<number>(0);
    const [feedbackCountChangePercent, setFeedbackCountChangePercent] = useState<number>(0);
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [filterModel, setFilterModel] = useState({});

    const handleGridReady = (params: FirstDataRenderedEvent) => {
        setGridApi(params.api);
    };

    const getData = async (postBody: Record<string, any> = filterOptions) => {
        setIsLoading(true);
        try {
            //GET DATA FROM API HERE
            //MOCKING DATA FOR DEMO PURPOSES
            const response: clientSatisfactionDashboardResponse = {
                resource: {
                    kpi: {
                        avgStaffRating: 4.5,
                        avgServiceRating: 4.2,
                        avgOverallRating: 4.3,
                        nps: 75,
                    },
                    nps: [
                        {
                            score: 75,
                            detractors: 10,
                            passives: 15,
                            promoters: 75,
                            totalResponses: 100,
                            monthYear: "2023-10",
                        },
                        {
                            score: 30,
                            detractors: 30,
                            passives: 40,
                            promoters: 30,
                            totalResponses: 100,
                            monthYear: "2023-11",
                        },
                        {
                            score: 55,
                            detractors: 20,
                            passives: 25,
                            promoters: 55,
                            totalResponses: 100,
                            monthYear: "2023-12",
                        },
                        {
                            score: 65,
                            detractors: 15,
                            passives: 20,
                            promoters: 65,
                            totalResponses: 100,
                            monthYear: "2024-01",
                        },
                        {
                            score: 80,
                            detractors: 5,
                            passives: 15,
                            promoters: 80,
                            totalResponses: 100,
                            monthYear: "2024-02",
                        },
                        {
                            score: 70,
                            detractors: 12,
                            passives: 18,
                            promoters: 70,
                            totalResponses: 100,
                            monthYear: "2024-03",
                        }
                    ],
                    topStaff: [
                        {
                            staffId: "1",
                            staffName: "John Doe",
                            positiveCount: 50,
                            neutralCount: 10,
                            negativeCount: 5,
                            avgRating: 4.7,
                        },
                        {
                            staffId: "3",
                            staffName: "Emily Johnson",
                            positiveCount: 45,
                            neutralCount: 5,
                            negativeCount: 2,
                            avgRating: 4.6,
                        },
                        {
                            staffId: "4",
                            staffName: "Michael Chen",
                            positiveCount: 42,
                            neutralCount: 10,
                            negativeCount: 3,
                            avgRating: 4.5,
                        },
                        {
                            staffId: "5",
                            staffName: "Sarah Wilson",
                            positiveCount: 40,
                            neutralCount: 10,
                            negativeCount: 5,
                            avgRating: 4.4,
                        },
                        {
                            staffId: "6",
                            staffName: "David Kim",
                            positiveCount: 39,
                            neutralCount: 8,
                            negativeCount: 4,
                            avgRating: 4.3,
                        }
                    ],
                    bottomStaff: [
                        {
                            staffId: "7",
                            staffName: "Alex Lee",
                            positiveCount: 20,
                            neutralCount: 15,
                            negativeCount: 15,
                            avgRating: 3.0,
                        },
                        {
                            staffId: "8",
                            staffName: "Rachel Brown",
                            positiveCount: 15,
                            neutralCount: 10,
                            negativeCount: 20,
                            avgRating: 2.8,
                        },
                        {
                            staffId: "9",
                            staffName: "Chris Evans",
                            positiveCount: 10,
                            neutralCount: 20,
                            negativeCount: 25,
                            avgRating: 2.5,
                        },
                        {
                            staffId: "10",
                            staffName: "Natalie Green",
                            positiveCount: 12,
                            neutralCount: 18,
                            negativeCount: 30,
                            avgRating: 2.3,
                        },
                        {
                            staffId: "11",
                            staffName: "Tom Walker",
                            positiveCount: 8,
                            neutralCount: 12,
                            negativeCount: 35,
                            avgRating: 2.1,
                        }
                    ],
                    staff: {
                        staffAvgRating: [
                            {
                                staffId: "1",
                                staffName: "John Doe",
                                positiveCount: 50,
                                neutralCount: 10,
                                negativeCount: 5,
                                avgRating: 4.7,
                            },
                            {
                                staffId: "2",
                                staffName: "Jane Smith",
                                positiveCount: 40,
                                neutralCount: 15,
                                negativeCount: 10,
                                avgRating: 4.2,
                            }
                        ],
                        staffComments: [
                            {
                                staffId: "1",
                                staffName: "John Doe",
                                comment: "Great service!",
                                site: "Site A",
                                date: "2023-10-01",
                                clientId: "1001",
                                clientName: "Client A",
                                rating: 5,
                            },
                            {
                                staffId: "2",
                                staffName: "Jane Smith",
                                comment: "Very friendly.",
                                site: "Site B",
                                date: "2023-12-15",
                                clientId: "1004",
                                clientName: "Client D",
                                rating: 4,
                            }
                        ],
                    },
                    service: {
                        serviceAvgRating: [
                            {
                                serviceId: "101",
                                serviceName: "Cleaning",
                                positiveCount: 40,
                                neutralCount: 8,
                                negativeCount: 2,
                                avgRating: 4.6,
                                monthYear: "2023-10",
                            },
                            {
                                serviceId: "102",
                                serviceName: "Security",
                                positiveCount: 35,
                                neutralCount: 10,
                                negativeCount: 5,
                                avgRating: 4.4,
                                monthYear: "2023-12",
                            }
                        ],
                        serviceComments: [
                            {
                                serviceId: "101",
                                serviceName: "Cleaning",
                                comment: "Excellent job!",
                                site: "Site B",
                                date: "2023-10-02",
                                clientId: "1002",
                                clientName: "Client B",
                                rating: 5,
                            },
                            {
                                serviceId: "102",
                                serviceName: "Security",
                                comment: "Always on time.",
                                site: "Site C",
                                date: "2023-12-16",
                                clientId: "1005",
                                clientName: "Client E",
                                rating: 4,
                            }
                        ],
                    },
                    companyComments: [
                        {
                            comment: "Overall great experience.",
                            site: "Site C",
                            date: "2023-10-03",
                            clientId: "1003",
                            clientName: "Client C",
                            rating: 5,
                        },
                        {
                            comment: "Responsive and professional.",
                            site: "Site A",
                            date: "2023-12-20",
                            clientId: "1006",
                            clientName: "Client F",
                            rating: 4,
                        }
                    ],
                    feedbackCount: {
                        feedbackCount: 100,
                        feedbackCountChangePercent: 10, // e.g. +10% from last week
                    },
                }
            };

            if (response && response.resource) {
                setKpiData(response.resource.kpi);
                setStaffData(response.resource.staff.staffAvgRating);
                setTopStaff(response.resource.topStaff);
                setBottomStaff(response.resource.bottomStaff);
                setNpsData({ scores: response.resource.nps });
                setServiceData(response.resource.service.serviceAvgRating);
                setCompanyComments(response.resource.companyComments);
                setStaffComments(response.resource.staff.staffComments);
                setServiceComments(response.resource.service.serviceComments);
                setFeedbackCount(response.resource.feedbackCount.feedbackCount);
                setFeedbackCountChangePercent(response.resource.feedbackCount.feedbackCountChangePercent);

                // Assign grid data using staff comments
                const staffCommentsData = response.resource.staff.staffComments.map((comment) => ({
                    type: "Staff",
                    staffId: comment.staffId,
                    staffName: comment.staffName,
                    comment: comment.comment,
                    site: comment.site,
                    date: comment.date,
                    clientId: comment.clientId,
                    clientName: comment.clientName,
                    rating: comment.rating,
                }));

                // Assign grid data using service comments
                const serviceCommentsData = response.resource.service.serviceComments.map((comment) => ({
                    type: "Service",
                    serviceId: comment.serviceId,
                    serviceName: comment.serviceName,
                    comment: comment.comment,
                    site: comment.site,
                    date: comment.date,
                    clientId: comment.clientId,
                    clientName: comment.clientName,
                    rating: comment.rating,
                }));

                setStaffCommentsGridData(staffCommentsData);
                setServiceCommentsGridData(serviceCommentsData);
            } else {
            }
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    };

    const onFilterChange = (postBody: Record<string, any>) => {
        setFilterOptions(postBody);
        getData(postBody);
    };

    let kpiGuagesOptions: AgRadialGaugeOptions[] = [];

    if (kpiData && npsData && staffData && serviceData && companyComments && topStaff && bottomStaff) {
        kpiGuagesOptions = [
            {
                background: {
                    fill: theme.colors.elementBG,
                },
                type: "radial-gauge",
                value: kpiData.avgStaffRating,
                scale: {
                    min: 0,
                    max: 10,
                },
                secondaryLabel: {
                    text: "Average Staff Rating",
                },
                cornerMode: "item",
                cornerRadius: 99,
                startAngle: 225,
                endAngle: 495,
                bar: {
                    fills: [
                        { color: "red", stop: -100 },
                        { color: theme.colors.yellow, stop: 0 },
                        { color: theme.colors.seduloGreen, stop: 100 },
                    ],
                    fillMode: "continuous",
                },
                segmentation: {
                    enabled: true,
                    interval: {
                        count: 3,
                    },
                    spacing: 4,
                },
            },
            {
                background: {
                    fill: theme.colors.elementBG,
                },
                type: "radial-gauge",
                value: kpiData.avgServiceRating,
                scale: {
                    min: 0,
                    max: 10,
                },
                secondaryLabel: {
                    text: "Average Service Rating",
                },
                cornerMode: "item",
                cornerRadius: 99,
                startAngle: 225,
                endAngle: 495,
                bar: {
                    fills: [
                        { color: "red", stop: -100 },
                        { color: theme.colors.yellow, stop: 0 },
                        { color: theme.colors.seduloGreen, stop: 100 },
                    ],
                    fillMode: "continuous",
                },
                segmentation: {
                    enabled: true,
                    interval: {
                        count: 3,
                    },
                    spacing: 4,
                },
            },
            {
                background: {
                    fill: theme.colors.elementBG,
                },
                type: "radial-gauge",
                value: kpiData.avgOverallRating,
                scale: {
                    min: 0,
                    max: 10,
                },
                secondaryLabel: {
                    text: "Average Overall Rating",
                },
                cornerMode: "item",
                cornerRadius: 99,
                startAngle: 225,
                endAngle: 495,
                bar: {
                    fills: [
                        { color: "red", stop: -100 },
                        { color: theme.colors.yellow, stop: 0 },
                        { color: theme.colors.seduloGreen, stop: 100 },
                    ],
                    fillMode: "continuous",
                },
                segmentation: {
                    enabled: true,
                    interval: {
                        count: 3,
                    },
                    spacing: 4,
                },
            },
            {
                background: {
                    fill: theme.colors.elementBG,
                },
                type: "radial-gauge",
                value: kpiData.nps,
                scale: {
                    min: -100,
                    max: 100,
                },
                secondaryLabel: {
                    text: "NPS Score",
                },
                cornerMode: "item",
                cornerRadius: 99,
                startAngle: 225,
                endAngle: 495,
                bar: {
                    fills: [
                        { color: "red", stop: -100 },
                        { color: theme.colors.yellow, stop: 0 },
                        { color: theme.colors.seduloGreen, stop: 100 },
                    ],
                    fillMode: "continuous",
                },
                segmentation: {
                    enabled: true,
                    interval: {
                        count: 3,
                    },
                    spacing: 4,
                },
            }
        ];
    };

    const dateRangeOption = "monthly";
    const defaultDateFilterOption = "last6Months";

    useEffect(() => {
        const monthlyOption = dateRangeOptions[dateRangeOption].find(
            (opt) => opt.value === defaultDateFilterOption
        );

        if (monthlyOption) {
            const [startDate, endDate] = monthlyOption.getRange();
            getData({ startDate, endDate });
        } else {
            getData();
        }
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!kpiData || !npsData || !staffData || !serviceData || !companyComments || !topStaff || !bottomStaff) {
        return <div>No data available</div>;
    }

    return (
        <>
            <FilterSidebar
                onApplyFilters={onFilterChange}
                filterOptions={{
                    showDepartmentsFilter: false,
                    showSitesFilter: false,
                    showDateFilter: true,
                }}
                dateFilterMode={dateRangeOption}
                defaultDateFilter={defaultDateFilterOption}
            />

            {/* KPI Cards */}
            <VStack align="stretch" spacing={6} w="full" py={4}>
                <Flex w={"100%"} gap={6} direction={"row"}>
                    {/* Gauge */}
                    <Flex w={"40%"} gap={6} direction={"column"}>
                        <AgGaugeComponent
                            flex={"100%"}
                            chartOptions={kpiGuagesOptions[3]}
                            noData={!kpiData.nps}
                            height="100%"
                        />
                    </Flex>
                    <Flex w={"60%"} gap={6} direction={"column"}>
                        <Flex w={"100%"} gap={6} direction={"row"}>
                            <AgGaugeComponent
                                flex={"50%"}
                                chartOptions={kpiGuagesOptions[0]}
                                noData={!kpiData.nps}
                                height="300px"
                            />
                            <AgGaugeComponent
                                flex={"50%"}
                                chartOptions={kpiGuagesOptions[2]}
                                noData={!kpiData.nps}
                                height="300px"
                            />
                        </Flex>
                        <Flex w={"100%"} gap={6} direction={"row"}>
                            <AgGaugeComponent
                                flex={"50%"}
                                chartOptions={kpiGuagesOptions[1]}
                                noData={!kpiData.nps}
                                height="300px"
                            />
                            <Box flex={"50%"} minWidth="300px" height={"300px"}>
                                <PerygonCard height={"100%"}>
                                    <Flex align="center" gap={1} direction="column" justifyContent="center" height={"100%"}>
                                        <Text fontSize={"6xl"}>{feedbackCount}</Text>
                                        <Text fontSize={"xl"}>Total Client Responses</Text>
                                        {feedbackCountChangePercent > 0 && (
                                            <>
                                                <Text fontSize="lg" fontWeight={"bold"} color="green.500">
                                                    Up {feedbackCountChangePercent}% From Last Week
                                                </Text>
                                            </>
                                        )}

                                        {feedbackCountChangePercent < 0 && (
                                            <>
                                                <Text fontSize="lg" fontWeight={"bold"} color="red.500">
                                                    Down {feedbackCountChangePercent}% From Last Week
                                                </Text>
                                            </>
                                        )}

                                        {feedbackCountChangePercent === 0 && (
                                            <Text fontSize="lg" fontWeight={"bold"}>
                                                0% Change From Last Week
                                            </Text>
                                        )}
                                    </Flex>
                                </PerygonCard>
                            </Box>
                        </Flex>
                    </Flex>
                </Flex>
            </VStack>

            {/* NPS Breakdown Bar Chart */}
            <VStack align="stretch" spacing={6} w="full" py={4}>
                <Flex w={"100%"} gap={6} flexWrap={"wrap"}>
                    <AgChartComponent
                        flex={"1 1 100%"}
                        title={"NPS Breakdown"}
                        chartOptions={{
                            type: "bar",
                            data: npsData.scores.map((score) => ({
                                month: score.monthYear,
                                detractors: score.detractors,
                                passives: score.passives,
                                promoters: score.promoters,
                            })),
                            series: [
                                {
                                    type: "bar",
                                    stacked: true,
                                    xKey: "month",
                                    yKey: "detractors",
                                    yName: "Detractors",
                                    fill: "red",
                                },
                                {
                                    type: "bar",
                                    stacked: true,
                                    xKey: "month",
                                    yKey: "passives",
                                    yName: "Passives",
                                    fill: "orange",
                                },
                                {
                                    type: "bar",
                                    stacked: true,
                                    xKey: "month",
                                    yKey: "promoters",
                                    yName: "Promoters",
                                    fill: "green",
                                },
                            ],
                            axes: [
                                {
                                    type: "category",
                                    position: "bottom",
                                    title: {
                                        text: "Month",
                                        fontSize: 12,
                                        fontWeight: 500,
                                    },
                                },
                                {
                                    type: "number",
                                    position: "left",
                                    title: {
                                        text: "Responses",
                                        fontSize: 12,
                                        fontWeight: 500,
                                    },
                                },
                            ],
                        }}
                        noData={npsData.scores.length === 0}
                    />
                </Flex>
            </VStack>

            {/* NPS Trend Line Chart */}
            <VStack align="stretch" spacing={6} w="full" py={4}>
                <Flex w={"100%"} gap={6} direction={"row"}>
                    <AgChartComponent
                        flex={"1 1 45%"}
                        title={"NPS Trend Over Time"}
                        chartOptions={{
                            type: "line",
                            data: npsData.scores.map((score) => ({
                                x: score.monthYear,
                                y: score.score,
                            })),
                            series: [
                                {
                                    type: "line",
                                    xKey: "x",
                                    yKey: "y",
                                    tooltip: {
                                        renderer: ScoreTooltipRenderer,
                                    },
                                },
                            ],
                        }}
                        noData={npsData.scores.length === 0}
                    />
                </Flex>
            </VStack>

            <VStack align="stretch" spacing={6} w="full" py={4}>
                <Flex w="100%" gap={6} flexWrap="wrap">
                    {/* Combine topStaff and bottomStaff */}
                    {topStaff && bottomStaff && (
                        <>
                            <AgChartComponent
                                flex="1 1 100%"
                                title="Staff Ratings (Top & Bottom 5)"
                                chartOptions={{
                                    type: "bar",
                                    data: [...topStaff, ...bottomStaff].map((staff) => ({
                                        name: staff.staffName,
                                        rating: staff.avgRating,
                                    })),
                                    series: [
                                        {
                                            type: "bar",
                                            xKey: "name",
                                            yKey: "rating",
                                            yName: "Average Rating",
                                            fill: "#4caf50",
                                            tooltip: {
                                                renderer: ({
                                                    datum,
                                                }: {
                                                    datum: { name: string; rating: number };
                                                }) => ({
                                                    content: `${datum.name}: ${datum.rating.toFixed(2)}`,
                                                }),
                                            },
                                        },
                                    ],
                                    axes: [
                                        {
                                            type: "category",
                                            position: "bottom",
                                            title: {
                                                text: "Staff Member",
                                                fontSize: 12,
                                                fontWeight: 500,
                                            },
                                            label: {
                                                rotation: -30,
                                            },
                                        },
                                        {
                                            type: "number",
                                            position: "left",
                                            title: {
                                                text: "Average Rating",
                                                fontSize: 12,
                                                fontWeight: 500,
                                            },
                                            min: 0,
                                            max: 10,
                                        },
                                    ],
                                }}
                                noData={
                                    !topStaff || topStaff.length === 0 || !bottomStaff || bottomStaff.length === 0
                                }
                            />

                            <AgChartComponent
                                flex="1 1 100%"
                                title="Staff Feedback Breakdown (Top & Bottom 5)"
                                chartOptions={{
                                    type: "bar",
                                    data: [...topStaff, ...bottomStaff].map((staff) => ({
                                        name: staff.staffName,
                                        positive: staff.positiveCount,
                                        neutral: staff.neutralCount,
                                        negative: staff.negativeCount,
                                    })),
                                    series: [
                                        {
                                            type: "bar",
                                            xKey: "name",
                                            yKey: "positive",
                                            yName: "Positive",
                                            stacked: true,
                                            fill: "#4caf50",
                                        },
                                        {
                                            type: "bar",
                                            xKey: "name",
                                            yKey: "neutral",
                                            yName: "Neutral",
                                            stacked: true,
                                            fill: "#ffeb3b",
                                        },
                                        {
                                            type: "bar",
                                            xKey: "name",
                                            yKey: "negative",
                                            yName: "Negative",
                                            stacked: true,
                                            fill: "#f44336",
                                        },
                                    ],
                                    axes: [
                                        {
                                            type: "category",
                                            position: "bottom",
                                            title: {
                                                text: "Staff Member",
                                                fontSize: 12,
                                                fontWeight: 500,
                                            },
                                            label: {
                                                rotation: -30,
                                            },
                                        },
                                        {
                                            type: "number",
                                            position: "left",
                                            title: {
                                                text: "Feedback Count",
                                                fontSize: 12,
                                                fontWeight: 500,
                                            },
                                        },
                                    ],
                                }}
                                noData={
                                    !topStaff || topStaff.length === 0 || !bottomStaff || bottomStaff.length === 0
                                }
                            />
                        </>
                    )}
                </Flex>
            </VStack>

            <DataGridComponentLight
                data={staffCommentsGridData}
                loading={isLoading}
                initialFields={staffCommentsColumnDefs}
                showTopBar={false}
                onGridReady={handleGridReady}
                refreshData={getData}
                enableAutoRefresh={true}
                title="Score and Comments"
            />

            <DataGridComponentLight
                data={serviceCommentsGridData}
                loading={isLoading}
                initialFields={serviceCommentsColumnDefs}
                showTopBar={false}
                onGridReady={handleGridReady}
                refreshData={getData}
                enableAutoRefresh={true}
                title="Service Comments"
            />
        </>
    );
}

export default ClientSatisfactionDashboard;
