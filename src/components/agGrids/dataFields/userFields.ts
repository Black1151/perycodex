import { ColDef } from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonsRenderer";

// Updated AgGrids fields
export const userFields: ColDef[] | any = [
    {
        field: 'id',
        headerName: 'ID',
        cellDataType: "number",
        maxWidth: 128,
        minWidth: 64,
        filter: "agNumberColumnFilter"
    },
    {
        field: 'email',
        headerName: 'Email',
        filter: "agTextColumnFilter",
        flex: 3
    },
    {
        field: 'role',
        headerName: 'Role',
        filter: "agMultiColumnFilter",
        flex: 3
    },
    {
        field: 'isActive',
        headerName: 'Active',
        cellDataType: "boolean",
        filter: "agSetColumnFilter",
        flex: 1,
    },
    {
        field: 'nothing',
        headerName: 'Actions',
        flex: 1,
        cellRenderer: ActionButtonRenderer,
        cellRendererParams: {
            redirectUrl: '/users'
        }
    },
];
