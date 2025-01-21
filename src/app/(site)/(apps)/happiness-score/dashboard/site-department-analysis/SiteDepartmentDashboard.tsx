"use client";

import React, {useEffect, useState} from "react";
import {
    Box,
    Flex,
    VStack,
    useTheme,
    useBreakpointValue,
    Select,
} from "@chakra-ui/react";
import {useUser} from "@/providers/UserProvider";
import {useFetchClient} from "@/hooks/useFetchClient";
import {SectionHeader} from "@/components/sectionHeader/SectionHeader";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import UserRenderer from "@/components/agGrids/CellRenderers/UserRenderer";
import HappinessScoreRenderer from "@/components/agGrids/CellRenderers/HappinessScoreRenderer";
import CommentsCellRenderer from "@/components/agGrids/CellRenderers/CommentsCellRenderer";
import {AgCharts} from "ag-charts-react";
import {AgCartesianChartOptions} from "ag-charts-enterprise";
import useColor from "@/hooks/useColor";

import {
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    subWeeks,
    subMonths,
    subYears,
    startOfYear,
    endOfYear,
    addWeeks,
    format,
} from "date-fns";
import SpeechBubble from "../../SpeechBubble";

interface ManagingPartnersResponse {
    resource: {
        totalAvg: number;
        gridData: any;
        weeklyLineChartComparisonData: any[];
        monthlyLineChartComparisonData: any[];
        leaderboardData: any[];
    };
}

// A helper function to create a separate series for each site name
// (i.e. each key except the xKey).
function generateSiteSeries(siteNames: string[], xKey: string) {
    return siteNames.map((siteName) => ({
        type: "line",
        xKey: xKey, // "week" or "month"
        yKey: siteName, // e.g. "Ambler Club (Leeds)"
        yName: siteName,
        marker: {enabled: true},
        interpolation: {type: "smooth"},
    }));
}

const SiteDepartmentDashboard: React.FC = () => {
    const {fetchClient} = useFetchClient();
    const {user} = useUser();
    const theme = useTheme();
    const {getColor} = useColor();
    const isMobile = useBreakpointValue({base: true, sm: true, md: false});

    const [selectedFilter, setSelectedFilter] = useState("");
    // We'll store them as strings in YYYY-MM-DD format
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);

    // States for each piece of data
    const [totalAvg, setTotalAvg] = useState<number>(0);
    const [gridData, setGridData] = useState<any[]>([]);
    const [weeklyLineChartComparisonData, setWeeklyLineChartComparisonData] =
        useState<any[]>([]);
    const [monthlyLineChartComparisonData, setMonthlyLineChartComparisonData] =
        useState<any[]>([]);
    const [leaderboardData, setLeaderboardData] = useState<any[]>([]);

    // Example column definitions for the grid
    const columnDefs = [
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

    const defaultColDef = {
        resizable: true,
        filter: true,
        suppressHeaderMenuButton: true,
    };

    // ------------------------------------------------------------------------------
    // 1) Fetch the data from our Next.js API route (which does the flattening)
    // ------------------------------------------------------------------------------
    const getData = async (overrideStart?: string, overrideEnd?: string) => {
        setIsLoading(true);
        try {
            const requestBody: Record<string, any> = {};

            // Only send start/end dates if both are non-null
            if (startDate && endDate) {
                requestBody.startDate = startDate;
                requestBody.endDate = endDate;
            }

            // If the caller passed overrideStart/end, use those
            if (overrideStart && overrideEnd) {
                requestBody.startDate = overrideStart;
                requestBody.endDate = overrideEnd;
            }

            // This route calls /getManagingPartnersDashboard on the server
            const response = await fetchClient<ManagingPartnersResponse>(
                "/api/happiness-graphs/site-department",
                {
                    method: "POST",
                    body: requestBody,
                    redirectOnError: false,
                },
            );

            if (response && response.resource) {
                const {
                    totalAvg: resTotalAvg,
                    gridData: resGridData,
                    weeklyLineChartComparisonData: resWeeklyData,
                    monthlyLineChartComparisonData: resMonthlyData,
                    leaderboardData: resLeaderboardData,
                } = response.resource;

                // Because the server is already returning them as arrays, just set them:
                setTotalAvg(resTotalAvg);
                setGridData(resGridData);
                setWeeklyLineChartComparisonData(resWeeklyData);
                setMonthlyLineChartComparisonData(resMonthlyData);
                setLeaderboardData(resLeaderboardData);
            } else {
                console.error("Invalid response:", response);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data once we know we have a user
    useEffect(() => {
        if (user) {
            getData();
        }
    }, [user]);

    const dateRanges: Record<string, () => [Date, Date]> = {
        // 1) Current Week: Mon–Sun of *this* week
        currentWeek: () => [
            startOfWeek(new Date(), {weekStartsOn: 1}),
            endOfWeek(new Date(), {weekStartsOn: 1}),
        ],

        // 2) Previous Week: Mon–Sun of the *previous* week
        previousWeek: () => [
            startOfWeek(subWeeks(new Date(), 1), {weekStartsOn: 1}),
            endOfWeek(subWeeks(new Date(), 1), {weekStartsOn: 1}),
        ],

        // 3) Current Month: startOfMonth -> endOfMonth
        currentMonth: () => [startOfMonth(new Date()), endOfMonth(new Date())],

        // 4) Previous Month: start/end of that previous month
        previousMonth: () => [
            startOfMonth(subMonths(new Date(), 1)),
            endOfMonth(subMonths(new Date(), 1)),
        ],

        // 5) Last 3 Months: 3 total months, including *this* month
        //    e.g. if now is August, covers June 1 -> August 31
        last3Months: () => [
            startOfMonth(subMonths(new Date(), 2)), // sub 2 = 3 total
            endOfMonth(new Date()),
        ],

        // 6) Last 6 Months: 6 total months, including *this* month
        last6Months: () => [
            startOfMonth(subMonths(new Date(), 5)), // sub 5 = 6 total
            endOfMonth(new Date()),
        ],

        // 7) Last 9 Months
        last9Months: () => [
            startOfMonth(subMonths(new Date(), 8)), // sub 8 = 9 total
            endOfMonth(new Date()),
        ],

        // 8) Last 12 Months
        last12Months: () => [
            startOfMonth(subMonths(new Date(), 11)), // sub 11 = 12 total
            endOfMonth(new Date()),
        ],

        // 9) Current Year: Jan 1 -> Dec 31 of *this* year
        currentYear: () => [startOfYear(new Date()), endOfYear(new Date())],

        // 10) Previous Year: Jan 1 -> Dec 31 of *last* year
        previousYear: () => {
            const lastYearDate = subYears(new Date(), 1);
            return [startOfYear(lastYearDate), endOfYear(lastYearDate)];
        },

        // 11) Last 2 Years: from 1 Jan of *last* year -> 31 Dec of *this* year
        //     e.g. if it's now 2025, covers 2024-01-01 -> 2025-12-31
        last2Years: () => [
            startOfYear(subYears(new Date(), 1)),
            endOfYear(new Date()),
        ],
    };

    // ------------------------------------------------------------------------------
    // 3) Handle filter changes
    // ------------------------------------------------------------------------------
    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selection = e.target.value;
        setSelectedFilter(selection);

        // If "All", just clear the dates and fetch everything
        if (!dateRanges[selection]) {
            setStartDate(null);
            setEndDate(null);
            getData();
            return;
        }

        // Otherwise, get the corresponding [start, end] from our map
        const [newStart, newEnd] = dateRanges[selection]();

        // Convert them to "yyyy-MM-dd" strings
        const formattedStart = format(newStart, "yyyy-MM-dd");
        const formattedEnd = format(newEnd, "yyyy-MM-dd");

        setStartDate(formattedStart);
        setEndDate(formattedEnd);

        getData(formattedStart, formattedEnd);
    };

    // ------------------------------------------------------------------------------
    // 4) Configurations for the charts
    // ------------------------------------------------------------------------------
    // Build dynamic "site" lines for the weekly data
    const weeklySiteNames =
        weeklyLineChartComparisonData.length > 0
            ? Object.keys(weeklyLineChartComparisonData[0]).filter(
                (key) => key !== "week",
            )
            : [];

    const weeklySeries = generateSiteSeries(weeklySiteNames, "week");

    const weeklyLineChartOptions = {
        data: weeklyLineChartComparisonData,
        series: weeklySeries,
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
                    text: "Week",
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
        contextMenu: {enabled: false},
        zoom: {enabled: false},
        navigator: {enabled: false},
        legend: {position: "bottom" as const},
        padding: {top: 20, left: 20, right: 20, bottom: 50},
    };

    // Build dynamic "site" lines for the monthly data
    const monthlySiteNames =
        monthlyLineChartComparisonData.length > 0
            ? Object.keys(monthlyLineChartComparisonData[0]).filter(
                (key) => key !== "month",
            )
            : [];

    const monthlySeries = generateSiteSeries(monthlySiteNames, "month");

    const monthlyLineChartOptions = {
        data: monthlyLineChartComparisonData,
        series: monthlySeries,
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
                    text: "Month",
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
        contextMenu: {enabled: false},
        zoom: {enabled: false},
        navigator: {enabled: false},
        legend: {position: "bottom" as const},
        padding: {top: 20, left: 20, right: 20, bottom: 50},
    };

    // Leaderboard for Period Bar Chart
    const sortedLeaderboard = [...leaderboardData].sort(
        (a, b) => b.currentWeekScore - a.currentWeekScore,
    );

    const leaderboardBarOptions: AgCartesianChartOptions = {
        data: sortedLeaderboard,
        padding: {top: 20, left: 20, right: 20, bottom: 50},
        series: [
            {
                type: "bar",
                xKey: "siteName",
                yKey: "currentWeekScore",
                yName: "Current Week",
                cornerRadius: 10,
                fill: theme.colors.seduloGreen,
                shadow: {
                    enabled: true,
                    color: "#191919",
                    xOffset: 1,
                    yOffset: 1,
                    blur: 4,
                },
            },
            {
                type: "bar",
                xKey: "siteName",
                yKey: "periodScore",
                yName: "Current Week",
                cornerRadius: 10,
                fill: theme.colors.yellow,
                shadow: {
                    enabled: true,
                    color: "#191919",
                    xOffset: 1,
                    yOffset: 1,
                    blur: 4,
                },
            },
        ],
        axes: [
            {
                type: "category",
                position: "bottom",
                label: {
                    rotation: 300,
                    fontSize: 10,
                    fontFamily: "Metropolis",
                    color: theme.colors.perygonPink,
                },
            },
            {
                type: "number",
                position: "left",
                label: {
                    fontSize: 10,
                    fontFamily: "Metropolis",
                    color: theme.colors.perygonPink,
                },
            },
        ],
        legend: {position: "bottom" as const},
    };

    // ------------------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------------------
    return (
        <VStack align="stretch" spacing={6} w="full" p={4}>
            {/* Date Filter Dropdown */}
            <Flex w="100%" height="100px" alignItems="center">
                <Select
                    placeholder="All (no date filter)"
                    value={selectedFilter}
                    onChange={handleFilterChange}
                    width="200px"
                >
                    <option value="currentWeek">Current Week</option>
                    <option value="previousWeek">Previous Week</option>
                    <option value="currentMonth">Current Month</option>
                    <option value="previousMonth">Previous Month</option>
                    <option value="last3Months">Last 3 Months</option>
                    <option value="last6Months">Last 6 Months</option>
                    <option value="last9Months">Last 9 Months</option>
                    <option value="last12Months">Last 12 Months</option>
                    <option value="currentYear">Current Year (YTD)</option>
                    <option value="previousYear">Previous Year (Jan - Dec)</option>
                    <option value="last2Years">Last 2 Years</option>
                </Select>
            </Flex>
            {/* Dashboard Layout */}
            <Flex w={"100%"} gap={6} flexWrap={"wrap"}>
                <Box flex={"1 1 250px"} textAlign="center" borderRadius="lg">
                    {/* Average Score */}
                    <Flex width="100%" justifyContent="center" align="center" mb={4}>
                        <SectionHeader>Average</SectionHeader>
                    </Flex>
                    <Box p={6}>
                        <SpeechBubble score={totalAvg} change={0}/>
                    </Box>
                </Box>

                {/* Scores and Comments */}
                <Box flex={"1 1 50%"} textAlign="center" borderRadius="lg">
                    <Flex width="100%" justifyContent="center" align="center" mb={4}>
                        <SectionHeader>Scores and Comments</SectionHeader>
                    </Flex>
                    <DataGridComponent
                        data={gridData}
                        loading={isLoading}
                        initialFields={columnDefs}
                        showTopBar
                        defaultColDef={defaultColDef}
                        refreshData={getData}
                        enableAutoRefresh
                    />
                </Box>

                {/* Period Leaderboard */}
                <Box flex={"1 1 50%"} textAlign="center" borderRadius="lg">
                    <Flex width="100%" justifyContent="center" align="center" mb={4}>
                        <SectionHeader>Leaderboard for Period</SectionHeader>
                    </Flex>
                    <Box borderRadius="2xl" shadow="xl" overflow="hidden" height="500px">
                        <AgCharts
                            options={leaderboardBarOptions as any}
                            style={{width: "100%", height: "100%"}}
                        />
                    </Box>
                </Box>

                {/*Weekly Chart*/}
                <Box flex={"1 1 100%"}>
                    <Flex width="100%" justifyContent="center" align="center" mb={4}>
                        <SectionHeader>Weekly Trend</SectionHeader>
                    </Flex>
                    <Box borderRadius="2xl" shadow="xl" overflow="hidden" height="500px">
                        <AgCharts
                            options={weeklyLineChartOptions as any}
                            style={{width: "100%", height: "100%"}}
                        />
                    </Box>
                </Box>
                {/* Monthly Chart */}
                <Box flex={"1 1 100%"}>
                    <Flex width="100%" justifyContent="center" align="center" mb={4}>
                        <SectionHeader>Monthly Comparison</SectionHeader>
                    </Flex>
                    <Box borderRadius="2xl" shadow="xl" overflow="hidden" height="500px">
                        <AgCharts
                            options={monthlyLineChartOptions as any}
                            style={{width: "100%", height: "100%"}}
                        />
                    </Box>
                </Box>

            </Flex>
        </VStack>
    );
};

export default SiteDepartmentDashboard;
