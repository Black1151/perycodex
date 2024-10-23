'use client';

import {ColDef} from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";

export const businessProcessFields: ColDef[] = [
    {
        field: "id",
        headerName: "ID",
        filter: "agNumberColumnFilter",
        maxWidth: 100,
        minWidth: 60,
        sortable: true,
    },
    {
        field: "name",
        headerName: "Business Process Name",
        filter: "agTextColumnFilter",
        minWidth: 200,
    },
    {
        field: "description",
        headerName: "Description",
        filter: "agTextColumnFilter",
        minWidth: 300,
    },
    {
        field: "isActive",
        headerName: "Actions",
        cellRenderer: ActionButtonRenderer, // A custom renderer for edit/delete actions
        cellRendererParams: {
            redirectUrl: "/business-processes",
            updateUrl: "/api/businessProcess/",
            idField: "id",
        },
        maxWidth: 150,
    },
];
