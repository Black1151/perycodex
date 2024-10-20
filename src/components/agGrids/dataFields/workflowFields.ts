'use client';

import {ColDef} from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";

export const workflowFields: ColDef[] = [
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
        headerName: "Workflow Name",
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
        cellRenderer: ActionButtonRenderer, // Renderer for actions (edit/delete)
        cellRendererParams: {
            redirectUrl: "/workflows",
            updateUrl: "/api/workflow/",
            idField: "id",
        },
        maxWidth: 150,
    },
];
