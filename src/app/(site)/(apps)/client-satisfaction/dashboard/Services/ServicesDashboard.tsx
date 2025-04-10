'use client'

import React, { useState } from 'react';
import { GridApi, FirstDataRenderedEvent } from 'ag-grid-community';
import DataGridComponentLight from "@/components/agGrids/DataGrid/DataGridComponentLight";
import { ServiceDashboardProps, serviceComment, serviceStat, histogramData } from "./types";
import AgChartComponent from "@/components/agCharts/AgChartComponent";
import { Flex } from "@chakra-ui/react";
import { servicesCommentsColumnDefs } from "./colDefs";
import { mockServiceDashboardData } from "./mockData";

const ServicesDashboard = () => {
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [rowData, setRowData] = useState<any[]>([]);
    const [gridData, setGridData] = useState<ServiceDashboardProps>(mockServiceDashboardData);

    const handleGridReady = (params: FirstDataRenderedEvent) => {
        setGridApi(params.api);
    };

    const scatterChartOptions = {
        autoSize: true,
        data: gridData.resource.serviceStats, // uses servicesStats now
        series: [
            {
                type: 'scatter',
                xKey: 'totalResponses',
                yKey: 'avgRating',
                marker: {
                    size: 10,
                    fill: '#4CAF50', // green for a better visual representation
                },
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

    const serviceStatsSorted = [...mockServiceDashboardData.resource.serviceStats].sort(
        (a, b) => a.nps - b.nps
    );

    const departmentComparisonChartOptions = {
        autoSize: true,
        data: serviceStatsSorted,
        title: {
            text: "Department Comparison: Avg Rating, NPS, Total Responses",
            fontSize: 16,
        },
        series: [
            {
                type: "bar",
                xKey: "serviceName",
                yKey: "avgRating",
                yName: "Average Rating",
                fill: "#4caf50",
            },
            {
                type: "bar",
                xKey: "serviceName",
                yKey: "nps",
                yName: "NPS",
                fill: "#ffeb3b",
            },
            {
                type: "bar",
                xKey: "serviceName",
                yKey: "totalResponses",
                yName: "Total Responses",
                fill: "#2196f3",
            },
        ],
        axes: [
            {
                type: "category",
                position: "bottom",
                title: { text: "Department" },
                label: {
                    rotation: -30,
                },
            },
            {
                type: "number",
                position: "left",
                title: { text: "Values" },
                min: 0,
            },
        ],
    };

    const npsStackedBarChartOptions = {
        autoSize: true,
        data: serviceStatsSorted, // already sorted by NPS ascending
        series: [
          {
            type: "bar",
            xKey: "serviceName",
            yKey: "detractors",
            yName: "Detractors",
            stacked: true,
            fill: "#f44336", // red
          },
          {
            type: "bar",
            xKey: "serviceName",
            yKey: "passives",
            yName: "Passives",
            stacked: true,
            fill: "#ffeb3b", // yellow
          },
          {
            type: "bar",
            xKey: "serviceName",
            yKey: "promoters",
            yName: "Promoters",
            stacked: true,
            fill: "#4caf50", // green
          },
        ],
        axes: [
          {
            type: "category",
            position: "bottom",
            title: { text: "Department" },
            label: {
              rotation: -30,
            },
          },
          {
            type: "number",
            position: "left",
            title: { text: "Number of Responses" },
            min: 0,
          },
        ],
      };
      

    return (
        <>
            {/* ADD FILTER BACK IN HERE */}

            <DataGridComponentLight
                data={gridData.resource.serviceComments}
                loading={isLoading}
                initialFields={servicesCommentsColumnDefs}
                showTopBar={false}
                onGridReady={handleGridReady}
                enableAutoRefresh={true}
                title="Services Score and Comments"
                groupDisplayType="groupRows"
            />

            <AgChartComponent
                flex="1"
                title="Average Rating, NPS, and Total Responses by Department"
                chartOptions={departmentComparisonChartOptions}
                noData={false}
            />

            <AgChartComponent
                flex="1"
                title="NPS Breakdown Bar Chart"
                chartOptions={npsStackedBarChartOptions}
                noData={false}
            />

            <AgChartComponent
                flex="1 1 100%"
                title="Total Responses vs Average Rating"
                chartOptions={scatterChartOptions}
                noData={false}
            />
        </>
    )
}

export default ServicesDashboard