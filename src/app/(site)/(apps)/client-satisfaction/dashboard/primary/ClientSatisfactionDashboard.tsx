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
import { clientSatisfactionDashboardResponse, kpiData, npsScore, staffRating, staffComment, serviceRating, serviceComment, npsData, companyComment } from "./types";
import { useFetchClient } from "@/hooks/useFetchClient";
import { useWorkflow } from "@/providers/WorkflowProvider";

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
    const { toolId, workflowId } = useWorkflow();

    const handleGridReady = (params: FirstDataRenderedEvent) => {
        setGridApi(params.api);
    };

    const { fetchClient } = useFetchClient();

    const getData = async (postBody: Record<string, any> = filterOptions) => {
        setIsLoading(true);
        try {
            const response = await fetchClient<clientSatisfactionDashboardResponse>(
                "/api/client-satisfaction/summary",
                {
                    method: "POST",
                    body: {
                        toolId,
                        workflowId,
                        ...postBody
                    }
                }
            );

            console.log("Response from API:", response);

            if (response && response) {
                setKpiData(response.resource.kpi);
                setStaffData(response.resource.staff.staffAvgRating);
                setTopStaff(response.resource.topStaff);
                setBottomStaff(response.resource.bottomStaff);
                setNpsData({ scores: response.resource.nps });
                setServiceData(response.resource.service.serviceAvgRating);
                setCompanyComments(response.resource.companyComments);
                setStaffComments(response.resource.staff.staffComments);
                setServiceComments(response.resource.service.serviceComments);
                setFeedbackCount(response.resource.kpi.feedbackCount);

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
            console.log("Error fetching data:", error);
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
        if (!toolId || !workflowId) {
            return;
        }
        const monthlyOption = dateRangeOptions[dateRangeOption].find(
            (opt) => opt.value === defaultDateFilterOption
        );

        if (monthlyOption) {
            const [startDate, endDate] = monthlyOption.getRange();
            getData({ startDate, endDate });
        } else {
            getData();
        }
    }, [toolId, workflowId]);

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
                <Flex
                    w="100%"
                    gap={6}
                    // Stack on smaller screens, side-by-side on md+
                    direction={{ base: "column", lg: "row" }}
                >
                    {/* Left column (Gauge) */}
                    <Flex
                        // 100% on mobile; 40% on lg+
                        w={{ base: "100%", lg: "40%" }}
                        gap={6}
                        direction="column"
                    // If you want the same height on mobile, you can fix height here.
                    // e.g., h={{ base: "300px", md: "auto" }}
                    >
                        <AgGaugeComponent
                            flex="1"
                            chartOptions={kpiGuagesOptions[3]}
                            noData={!kpiData.nps}
                            // You could also make the height responsive:
                            // height={{ base: "300px", md: "100%" }}
                            height="100%"
                        />
                    </Flex>

                    {/* Right column */}
                    <Flex
                        w={{ base: "100%", lg: "60%" }}
                        gap={6}
                        direction="column"
                    >
                        {/* Row #1 on desktop; stack on mobile */}
                        <Flex
                            w="100%"
                            gap={6}
                            direction={{ base: "column", md: "row" }}
                        >
                            <AgGaugeComponent
                                flex="1"
                                chartOptions={kpiGuagesOptions[0]}
                                noData={!kpiData.nps}
                                height="300px"
                            />
                            <AgGaugeComponent
                                flex="1"
                                chartOptions={kpiGuagesOptions[2]}
                                noData={!kpiData.nps}
                                height="300px"
                            />
                        </Flex>

                        {/* Row #2 on desktop; stack on mobile */}
                        <Flex
                            w="100%"
                            gap={6}
                            direction={{ base: "column", md: "row" }}
                        >
                            <AgGaugeComponent
                                flex="1"
                                chartOptions={kpiGuagesOptions[1]}
                                noData={!kpiData.nps}
                                height="300px"
                            />
                            <Box
                                flex="1"
                                minWidth="300px"
                                height="300px"
                            >
                                <PerygonCard height="100%">
                                    <Flex
                                        align="center"
                                        gap={1}
                                        direction="column"
                                        justifyContent="center"
                                        height="100%"
                                    >
                                        <Text fontSize="6xl">{feedbackCount}</Text>
                                        <Text fontSize="xl">Total Client Responses</Text>
                                    </Flex>
                                </PerygonCard>
                            </Box>
                        </Flex>
                    </Flex>
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

            {/* NPS Breakdown Bar Chart */}
            <VStack align="stretch" spacing={6} w="full" py={4}>
                <Flex w={"100%"} gap={6} flexWrap={"wrap"}>
                    <AgChartComponent
                        flex={"1 1 100%"}
                        title={"Promoters, Passives & Detractors Over Time"}
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

            <VStack align="stretch" spacing={6} w="full" py={4}>
                <Flex w="100%" gap={6} flexWrap="wrap">
                    {/* Combine topStaff and bottomStaff */}
                    {topStaff && bottomStaff && (
                        <>
                            <Flex direction={{ base: "column", md: "row" }} gap={6} w="100%">
                                {/* Top 5 Staff Ratings */}
                                <AgChartComponent
                                    flex="1"
                                    title="Top 5 Average Staff Ratings"
                                    chartOptions={{
                                        type: "bar",
                                        data: topStaff.map((staff) => ({
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
                                                    renderer: ({ datum }: { datum: { name: string; rating: number } }) => ({
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
                                    noData={!topStaff || topStaff.length === 0}
                                />

                                {/* Top 5 Feedback Breakdown */}
                                <AgChartComponent
                                    flex="1"
                                    title="Top 5 Staff Feedback Breakdown"
                                    chartOptions={{
                                        type: "bar",
                                        data: topStaff.map((staff) => ({
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
                                    noData={!topStaff || topStaff.length === 0}
                                />
                            </Flex>

                            <Flex direction={{ base: "column", md: "row" }} gap={6} w="100%">
                                {/* Bottom 5 Staff Ratings */}
                                <AgChartComponent
                                    flex="1"
                                    title="Bottom 5 Average Staff Ratings"
                                    chartOptions={{
                                        type: "bar",
                                        data: bottomStaff.map((staff) => ({
                                            name: staff.staffName,
                                            rating: staff.avgRating,
                                        })),
                                        series: [
                                            {
                                                type: "bar",
                                                xKey: "name",
                                                yKey: "rating",
                                                yName: "Average Rating",
                                                fill: "#f44336", // Optional: use red for low ratings
                                                tooltip: {
                                                    renderer: ({ datum }: { datum: { name: string; rating: number } }) => ({
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
                                    noData={!bottomStaff || bottomStaff.length === 0}
                                />

                                {/* Bottom 5 Feedback Breakdown */}
                                <AgChartComponent
                                    flex="1"
                                    title="Bottom 5 Staff Feedback Breakdown"
                                    chartOptions={{
                                        type: "bar",
                                        data: bottomStaff.map((staff) => ({
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
                                    noData={!bottomStaff || bottomStaff.length === 0}
                                />
                            </Flex>

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
                groupDisplayType="groupRows"
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
                groupDisplayType="groupRows"
            />
        </>
    );
}

export default ClientSatisfactionDashboard;