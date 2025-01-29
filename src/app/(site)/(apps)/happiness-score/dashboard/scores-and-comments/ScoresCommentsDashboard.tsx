"use client";

import React, {useState} from "react";
import {
    Text,
    useBreakpointValue,
} from "@chakra-ui/react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-charts-enterprise";
import {
    ColDef,
    CreateCrossFilterChartParams,
} from "ag-grid-community";
import DataGridComponentLight from "@/components/agGrids/DataGrid/DataGridComponentLight";
import FilterArea from "@/app/(site)/(apps)/happiness-score/dashboard/site-department-analysis/FilterArea";
import StaffHappinessDetailsRenderer
    from "@/components/agGrids/CellRenderers/HappinessScore/StaffHappinessDetailsRenderer";
import HappinessScoreRenderer from "@/components/agGrids/CellRenderers/HappinessScoreRenderer";
import CommentsCellRenderer from "@/components/agGrids/CellRenderers/CommentsCellRenderer";


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
    const [gridData, setGridData] = useState<Record<string, any>[]>([]);
    const [loading, setLoading] = useState<boolean>(false);


    const [filterOptions, setFilterOptions] = useState<Record<string, any>>({});

    const defaultColDef: ColDef = {
        resizable: true,
        filter: false,
        sortable: false,
        flex: isMobile ? 0 : 1,
        suppressHeaderMenuButton: true,
    };

    const columnDefs: ColDef[] = [
        {
            headerName: "Name",
            field: "fullName",
            sortable: false,
            filter: false,
            resizable: false,
            cellRenderer: StaffHappinessDetailsRenderer,
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
            field: "eowDate",
            headerName: "Week",
            sort: "asc",
            chartDataType: "category",
        },
        {
            field: "monthYear",
            headerName: "Month - Year",
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


    const getData = async (postBody: Record<string, any> = filterOptions) => {
        console.log("Getting data:", postBody);
    }

    const onFilterChange = (postBody: Record<string, any>) => {
        setFilterOptions(postBody);
        getData(postBody);
    }


    return (

        <>
            <FilterArea onApplyFilters={onFilterChange}/>
            <Text>
                Scores and Comments Dashboard
            </Text>
            <DataGridComponentLight
                data={gridData}
                loading={loading}
                initialFields={columnDefs}
                showTopBar={true}
                defaultColDef={defaultColDef}
                // onGridReady={handleGridReady}
                refreshData={getData}
                enableAutoRefresh={true}
                title={'Score and Comments'}

            />
        </>
    )
};
export default ScoresCommentsDashboard;
