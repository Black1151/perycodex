'use client';

import React, { useState, useMemo } from 'react';
import { GridApi, FirstDataRenderedEvent } from 'ag-grid-community';
import { Flex } from "@chakra-ui/react";
import DataGridComponentLight from "@/components/agGrids/DataGrid/DataGridComponentLight";
import AgChartComponent from "@/components/agCharts/AgChartComponent";
import FilterSidebar from "@/components/Sidebars/Dashboards Filter/FilterSidebar";
import { staffCommentsColumnDefs } from './colDefsX';
import { StaffDashboardProps } from './types';

const StaffDashboard = () => {
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [gridData, setGridData] = useState<StaffDashboardProps | null>(null);

    const handleGridReady = (params: FirstDataRenderedEvent) => {
        setGridApi(params.api);
    };

    const onApplyFilters = async (postBody: { startDate?: Date; endDate?: Date; siteId?: string }) => {
        if (!postBody.startDate || !postBody.endDate) return;

        setIsLoading(true);

        try {
            const res = await fetch("/api/client-satisfaction/staff", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    startDate: postBody.startDate,
                    endDate: postBody.endDate,
                    siteId: postBody.siteId,
                }),
            });

            if (!res.ok) throw new Error("Failed to fetch staff dashboard data");

            const data: StaffDashboardProps = await res.json();
            setGridData(data);
        } catch (err) {
            console.error("Error loading staff dashboard:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const staffStats = useMemo(() => gridData?.resource.staffStats || [], [gridData]);

    const top5ResponseCounts = useMemo(() => {
        return [...staffStats].sort((a, b) => b.totalResponses - a.totalResponses).slice(0, 5);
    }, [staffStats]);

    const top5Averages = useMemo(() => {
        return [...staffStats].sort((a, b) => b.avgRating - a.avgRating).slice(0, 5);
    }, [staffStats]);

    const scatterChartOptions = {
        autoSize: true,
        data: staffStats,
        series: [
            {
                type: 'scatter',
                xKey: 'totalResponses',
                yKey: 'avgRating',
                marker: {
                    size: 10,
                    fill: '#4CAF50',
                },
                tooltip: {
                    renderer: ({ datum }: { datum: { staffName: string; totalResponses: number; avgRating: number } }) => ({
                        content: `${datum.staffName}\nResponses: ${datum.totalResponses}\nAvg Rating: ${datum.avgRating.toFixed(2)}`
                    })
                }
            }
        ],
        axes: [
            {
                type: 'number',
                position: 'bottom',
                title: { text: 'Total Responses' },
                min: 0,
            },
            {
                type: 'number',
                position: 'left',
                title: { text: 'Average Rating' },
                min: 0,
                max: 10,
            }
        ],
    };

    const top5AveragesChartOptions = {
        autoSize: true,
        data: top5Averages,
        title: {
            text: "Top 5 Staff by Average Rating",
            fontSize: 16,
        },
        series: [
            {
                type: 'bar',
                xKey: 'staffName',
                yKey: 'avgRating',
                yName: 'Average Rating',
                fill: '#4caf50',
                tooltip: {
                    renderer: ({ datum }: { datum: { staffName: string; avgRating: number } }) => ({
                        content: `${datum.staffName}: ${datum.avgRating.toFixed(2)} average rating`,
                    }),
                },
            },
        ],
        axes: [
            {
                type: 'category',
                position: 'bottom',
                title: { text: 'Staff Member' },
                label: { rotation: -30 },
            },
            {
                type: 'number',
                position: 'left',
                title: { text: 'Average Rating' },
                min: 0,
                max: 10,
            },
        ],
    };

    const top5ResponseCountsChartOptions = {
        autoSize: true,
        data: top5ResponseCounts,
        title: {
            text: "Top 5 Staff by Total Responses",
            fontSize: 16,
        },
        series: [
            {
                type: 'bar',
                xKey: 'staffName',
                yKey: 'totalResponses',
                yName: 'Total Responses',
                fill: '#3f51b5',
                tooltip: {
                    renderer: ({ datum }: { datum: { staffName: string; totalResponses: number } }) => ({
                        content: `${datum.staffName}: ${datum.totalResponses} responses`,
                    }),
                },
            },
        ],
        axes: [
            {
                type: 'category',
                position: 'bottom',
                title: { text: 'Staff Member' },
                label: { rotation: -30 },
            },
            {
                type: 'number',
                position: 'left',
                title: { text: 'Total Responses' },
                min: 0,
            },
        ],
    };

    return (
        <>
            <FilterSidebar
                onApplyFilters={onApplyFilters}
                filterOptions={{
                    showDateFilter: true,
                    showSitesFilter: true,
                    showDepartmentsFilter: true,
                }}
                dateFilterMode="monthly"
                defaultDateFilter="currentMonth"
            />

            <DataGridComponentLight
                data={gridData?.resource.staffComments || []}
                loading={isLoading}
                initialFields={staffCommentsColumnDefs}
                showTopBar={false}
                onGridReady={handleGridReady}
                enableAutoRefresh={true}
                title="Staff Score and Comments"
                groupDisplayType="groupRows"
            />

            <Flex w="100%" gap={6} direction={{ base: "column", lg: "row" }}>
                <AgChartComponent
                    flex="1"
                    title="Top 5 Staff by Average Rating"
                    chartOptions={top5AveragesChartOptions}
                    noData={!top5Averages.length}
                />

                <AgChartComponent
                    flex="1"
                    title="Top 5 Staff by Total Responses"
                    chartOptions={top5ResponseCountsChartOptions}
                    noData={!top5ResponseCounts.length}
                />
            </Flex>

            <AgChartComponent
                flex="1 1 100%"
                title="Staff Score and Comments"
                chartOptions={scatterChartOptions}
                noData={!staffStats.length}
            />
        </>
    );
};

export default StaffDashboard;
