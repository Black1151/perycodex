'use client'

import React, { useState } from 'react';
import { GridApi, FirstDataRenderedEvent } from 'ag-grid-community';
import DataGridComponentLight from "@/components/agGrids/DataGrid/DataGridComponentLight";
import { StaffDashboardProps, staffComment, staffStats, histogramData } from "./types";
import { staffCommentsColumnDefs } from "./colDefs";
import { staffCommentsGridData } from "./mockData";
import AgChartComponent from "@/components/agCharts/AgChartComponent";
import { Flex } from "@chakra-ui/react";
import FilterSidebar from "@/components/Sidebars/Dashboards Filter/FilterSidebar";

const StaffDashboard = () => {
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [rowData, setRowData] = useState<any[]>([]);
    const [gridData, setGridData] = useState<StaffDashboardProps>(staffCommentsGridData);

    const handleGridReady = (params: FirstDataRenderedEvent) => {
        setGridApi(params.api);
    };

    const top5ResponseCounts = [...gridData.resource.staffStats]
        .sort((a, b) => b.totalResponses - a.totalResponses)
        .slice(0, 5);

    const top5Averages = [...gridData.resource.staffStats]
        .sort((a, b) => b.avgRating - a.avgRating)
        .slice(0, 5);

    const scatterChartOptions = {
        autoSize: true,
        data: gridData.resource.staffStats, // uses staffStats now
        series: [
            {
                type: 'scatter',
                xKey: 'totalResponses',
                yKey: 'avgRating',
                marker: {
                    size: 10,
                    fill: '#4CAF50', // green for a better visual representation
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
                title: {
                    text: 'Total Responses'
                },
                min: 0,
            },
            {
                type: 'number',
                position: 'left',
                title: {
                    text: 'Average Rating'
                },
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
            {/* ADD FILTER BACK IN HERE */}
            
            <DataGridComponentLight
                data={gridData.resource.staffComments}
                loading={isLoading}
                initialFields={staffCommentsColumnDefs}
                showTopBar={false}
                onGridReady={handleGridReady}
                enableAutoRefresh={true}
                title="Staff Score and Comments"
                groupDisplayType="groupRows"
            />

            <Flex
                w="100%"
                gap={6}
                direction={{ base: "column", lg: "row" }}
            >
                <AgChartComponent
                    flex="1"
                    title="Top 5 Staff by Average Rating"
                    chartOptions={top5AveragesChartOptions}
                    noData={false}
                />

                <AgChartComponent
                    flex="1"
                    title="Top 5 Staff by Total Responses"
                    chartOptions={top5ResponseCountsChartOptions}
                    noData={false}
                />
            </Flex>


            <AgChartComponent
                flex="1 1 100%"
                title="Staff Score and Comments"
                chartOptions={scatterChartOptions}
                noData={false}
            />
        </>
    )
}

export default StaffDashboard