import {ColDef} from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";

export const toolFields: ColDef[] = [
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
        headerName: "Tool Name",
        filter: "agTextColumnFilter",
    },
    {
        field: "description",
        headerName: "Description",
        filter: "agTextColumnFilter",
    },
    {
        field: "previewText",
        headerName: "Preview Text",
        filter: "agTextColumnFilter",
    },
    {
        field: "appUrl",
        headerName: "App URL",
        filter: "agTextColumnFilter",
    },
    {
        field: "categoryId",
        headerName: "Category ID",
        filter: "agNumberColumnFilter",
        maxWidth: 150,
    },
    {
        field: "isActive",
        headerName: "Actions",
        cellRenderer: ActionButtonRenderer,
        cellRendererParams: {
            redirectUrl: "/tools",
            updateUrl: "/api/toolConfig/",
            idField: "id",
        },
    },
];
