import {ColDef} from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";

// Updated AgGrids fields
export const userFields: ColDef[] | any = [
    {
        field: "id",
        headerName: "ID",
        filter: "agMultiColumnFilter",
        flex: 1
    },
    {
        field: 'fullName',
        headerName: 'Name',
        filter: "agMultiColumnFilter",
        flex: 2
    },
    {
        field: 'email',
        headerName: 'Email',
        filter: "agTextColumnFilter",
        flex: 1
    },
    {
        field: 'role',
        headerName: 'Role',
        filter: "agMultiColumnFilter",
        flex: 1
    },
    {
        field: 'jobTitle',
        headerName: 'Job Title',
        filter: "agMultiColumnFilter",
        flex: 2
    },
    {
        field: 'custName',
        headerName: 'Customer',
        filter: "agMultiColumnFilter",
        flex: 2
    },
    {
        field: 'siteName',
        headerName: 'Site',
        filter: "agMultiColumnFilter",
        flex: 2
    },
    {
        field: 'isActive',
        headerName: 'Actions',
        flex: 1,
        cellRenderer: ActionButtonRenderer,
        cellRendererParams: {
            redirectUrl: '/users',
            updateUrl: '/api/user/',
            idField: 'userUniqueId'
        }
    },
];
