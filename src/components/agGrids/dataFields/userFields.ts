import {ColDef} from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";
import UserImageRenderer from "@/components/agGrids/CellRenderers/UserImageRenderer";
import OrganisationLogoRenderer from "@/components/agGrids/CellRenderers/OrganisationLogoRenderer";

// Updated AgGrids fields
export const userFields: ColDef[] | any = [
    {
        field: "id",
        headerName: "ID",
        filter: "agMultiColumnFilter",
        maxWidth: 128,
        minWidth: 64,
        // flex: 1
    },
    {
        field: 'fullName',
        headerName: 'Name',
        filter: "agMultiColumnFilter",
        // flex: 1,
        cellRenderer: UserImageRenderer,
        cellRendererParams: {
            uniqueIdField: 'uniqueId',
            nameField: 'fullName',
            imageUrlField: 'imageUrl',
        }
    },
    {
        field: 'email',
        headerName: 'Email',
        filter: "agMultiColumnFilter",
        // flex: 1
    },
    {
        field: 'role',
        headerName: 'Role',
        filter: "agMultiColumnFilter",
        // flex: 1
    },
    {
        field: 'jobTitle',
        headerName: 'Job Title',
        filter: "agMultiColumnFilter",
        // flex: 2
    },
    {
        field: 'custName',
        headerName: 'Customer',
        filter: "agMultiColumnFilter",
        // flex: 2,
        cellRenderer: OrganisationLogoRenderer,
        cellRendererParams: {
            nameField: 'custName',
            imageUrlField: 'custImageUrl',
            idField: 'custUniqueId',
        }
    },
    {
        field: 'siteName',
        headerName: 'Site',
        filter: "agMultiColumnFilter",
        // flex: 2
    },
    {
        field: 'isActive',
        headerName: 'Actions',
        // flex: 1,
        cellRenderer: ActionButtonRenderer,
        cellRendererParams: {
            redirectUrl: '/users',
            updateUrl: '/api/user/',
            idField: 'userUniqueId'
        }
    },
];
