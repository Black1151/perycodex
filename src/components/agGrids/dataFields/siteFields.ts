import { ColDef } from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";

// Updated AgGrids fields for Sites
export const siteFields: ColDef[] | any = [
    {
        field: 'id',
        headerName: 'ID',
        cellDataType: "number",
        maxWidth: 128,
        minWidth: 64,
        filter: "agNumberColumnFilter"
    },
    {
        field: 'siteName',
        headerName: 'Site Name',
        filter: "agTextColumnFilter",
        flex: 3
    },
    {
        field: 'uniqueId',
        headerName: 'Unique ID',
        filter: "agTextColumnFilter",
        flex: 3
    },
    {
        field: 'postcode',
        headerName: 'Postcode',
        filter: "agTextColumnFilter",
        flex: 1
    },
    {
        field: 'customerId',
        headerName: 'Customer ID',
        cellDataType: "number",
        filter: "agNumberColumnFilter",
        flex: 1
    },
    {
        field: 'isActive',
        headerName: 'Active',
        cellDataType: "boolean",
        filter: "agSetColumnFilter",
        flex: 1
    },
    {
        field: 'nothing',
        headerName: 'Actions',
        flex: 1,
        cellRenderer: ActionButtonRenderer,
        cellRendererParams: {
            redirectUrl: '/sites'
        }
    },
];
