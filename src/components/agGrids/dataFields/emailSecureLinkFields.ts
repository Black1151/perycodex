import {ColDef} from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";
import CustomerRenderer from "@/components/agGrids/CellRenderers/CustomerRenderer";
import EmailScheduleRenderer from "@/components/agGrids/CellRenderers/EmailScheduleRenderer";
import UserRenderer from "@/components/agGrids/CellRenderers/UserRenderer";
import EmailSecureLinkRenderer from "@/components/agGrids/CellRenderers/EmailSecureLinkRenderer";

// Updated AgGrids fields
export const emailSecureLinkFields: ColDef[] | any = [
    {
        field: "id",
        headerName: "ID",
        filter: "agNumberColumnFilter",
        maxWidth: 128,
        minWidth: 64,
    },
    {
        field: 'name',
        headerName: 'Name',
        filter: "agMultiColumnFilter",
        cellRenderer: EmailSecureLinkRenderer,
        cellRendererParams: {
            uniqueIdField: 'id',
            nameField: 'name',
        }
    },
    {
        field: 'toolId',
        headerName: 'Tool ID',
        filter: "agMultiColumnFilter",
    },
    {
        field: 'toolName',
        headerName: 'Tool Name',
        filter: "agMultiColumnFilter",
    },
    {
        field: 'toUserId',
        headerName: 'User',
        filter: "agMultiColumnFilter",
        cellRenderer: UserRenderer,
        cellRendererParams: {
            uniqueIdField: 'userUniqueId',
            nameField: 'userFullName',
            imageUrlField: 'userImageUrl'
        }
    },
    {
        field: 'toCustomerId',
        headerName: 'Customer',
        filter: "agMultiColumnFilter",
        cellRenderer: CustomerRenderer,
        cellRendererParams: {
            uniqueIdField: 'custUniqueId',
            nameField: 'custName',
            imageUrlField: 'custImageUrl'
        }
    },
    {
        field: 'isActive',
        headerName: '',
        cellRenderer: ActionButtonRenderer,
        cellRendererParams: {
            redirectUrl: '/email-secure-link',
            updateUrl: '/api/emailSecureLink/',
            idField: 'id',
        }
    },
];

