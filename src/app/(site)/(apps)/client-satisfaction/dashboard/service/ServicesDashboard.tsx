'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { GridApi, FirstDataRenderedEvent } from 'ag-grid-community';
import { Flex } from "@chakra-ui/react";
import { format, parseISO } from 'date-fns';

import DataGridComponentLight from "@/components/agGrids/DataGrid/DataGridComponentLight";
import AgChartComponent from "@/components/agCharts/AgChartComponent";
import { servicesCommentsColumnDefs } from "./colDefs";
import FilterSidebar from "@/components/Sidebars/Dashboards Filter/FilterSidebar";
import { ServiceDashboardProps } from "./types";

const ServicesDashboard = () => {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gridData, setGridData] = useState<ServiceDashboardProps | null>(null);

  const handleGridReady = (params: FirstDataRenderedEvent) => {
    setGridApi(params.api);
  };

  const onApplyFilters = async (postBody: { startDate?: Date; endDate?: Date }) => {
    if (!postBody.startDate || !postBody.endDate) return;

    setIsLoading(true);

    try {
      const res = await fetch("/api/client-satisfaction/dashboard/service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: postBody.startDate,
          endDate: postBody.endDate,
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch dashboard data");

      const data: ServiceDashboardProps = await res.json();
      setGridData(data);
    } catch (err) {
      console.error("Error loading service dashboard:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const serviceStatsSorted = useMemo(() => {
    return gridData?.resource.serviceStats
      ? [...gridData.resource.serviceStats].sort((a, b) => a.nps - b.nps)
      : [];
  }, [gridData]);

  const scatterChartOptions = {
    autoSize: true,
    data: gridData?.resource.serviceStats || [],
    series: [
      {
        type: 'scatter',
        xKey: 'totalResponses',
        yKey: 'avgRating',
        marker: {
          size: 10,
          fill: '#4CAF50',
        },
      },
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
      },
    ],
  };

  const departmentComparisonChartOptions = {
    autoSize: true,
    data: serviceStatsSorted,
    title: {
      text: "Department Comparison: Avg Rating, NPS, Total Responses",
      fontSize: 16,
    },
    series: [
      { type: "bar", xKey: "serviceName", yKey: "avgRating", yName: "Average Rating", fill: "#4caf50" },
      { type: "bar", xKey: "serviceName", yKey: "nps", yName: "NPS", fill: "#ffeb3b" },
      { type: "bar", xKey: "serviceName", yKey: "totalResponses", yName: "Total Responses", fill: "#2196f3" },
    ],
    axes: [
      { type: "category", position: "bottom", title: { text: "Department" }, label: { rotation: -30 } },
      { type: "number", position: "left", title: { text: "Values" }, min: 0 },
    ],
  };

  const npsStackedBarChartOptions = {
    autoSize: true,
    data: serviceStatsSorted,
    series: [
      { type: "bar", xKey: "serviceName", yKey: "detractors", yName: "Detractors", stacked: true, fill: "#f44336" },
      { type: "bar", xKey: "serviceName", yKey: "passives", yName: "Passives", stacked: true, fill: "#ffeb3b" },
      { type: "bar", xKey: "serviceName", yKey: "promoters", yName: "Promoters", stacked: true, fill: "#4caf50" },
    ],
    axes: [
      { type: "category", position: "bottom", title: { text: "Department" }, label: { rotation: -30 } },
      { type: "number", position: "left", title: { text: "Number of Responses" }, min: 0 },
    ],
  };

  return (
    <>
      <FilterSidebar
        onApplyFilters={onApplyFilters}
        filterOptions={{
          showDateFilter: true,
          showSitesFilter: false,
          showDepartmentsFilter: true,
        }}
        dateFilterMode="monthly"
        defaultDateFilter="currentMonth"
      />

      <DataGridComponentLight
        data={gridData?.resource.serviceComments || []}
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
        noData={!serviceStatsSorted.length}
      />

      <AgChartComponent
        flex="1"
        title="NPS Breakdown Bar Chart"
        chartOptions={npsStackedBarChartOptions}
        noData={!serviceStatsSorted.length}
      />

      <AgChartComponent
        flex="1 1 100%"
        title="Total Responses vs Average Rating"
        chartOptions={scatterChartOptions}
        noData={!serviceStatsSorted.length}
      />
    </>
  );
};

export default ServicesDashboard;
