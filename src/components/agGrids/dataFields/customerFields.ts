import { ColDef } from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonsRenderer";

// Updated AgGrids fields
export const customerFields: ColDef[] | any = [
    {
        field: 'id',
        headerName: 'ID',
        cellDataType: "number",
        maxWidth: 128,
        minWidth: 64,
        filter: "agNumberColumnFilter"
    },
    {
        field: 'name',
        headerName: 'Name',
        filter: "agMultiColumnFilter",
        flex: 3
    },
    {
        field: 'customerCode',
        headerName: 'Customer Code',  // Renamed header to reflect 'customerCode' field
        filter: "agMultiColumnFilter",  // This should be a text filter since it's a code
        flex: 1,
    },
    {
        field: 'isActive',
        headerName: 'Active',  // Changed header name to reflect active status
        cellDataType: "boolean",  // Using boolean for true/false
        filter: "agSetColumnFilter",  // You can filter by true/false
        flex: 1,
    },
    {
        field: 'uniqueId',
        headerName: 'Unique ID',  // Display the unique ID
        filter: "agTextColumnFilter",  // Text filter since it's a string
        flex: 2,
    },
    {
        field: 'nothing',
        headerName: 'Actions',
        flex: 1,
        cellRenderer: ActionButtonRenderer,
        cellRendererParams: {
            redirectUrl: '/customers'
        }
    },
];
