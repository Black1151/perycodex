import {ColDef} from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";
import OrganisationLogoRenderer from "@/components/agGrids/CellRenderers/OrganisationLogoRenderer";

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
        cellRenderer: OrganisationLogoRenderer,
        cellRendererParams: {
            idField: 'custId',
            nameField: 'name',
            imageUrlField: 'imageUrl'
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
        headerName: 'User ID',
        filter: "agMultiColumnFilter",
        cellRenderer: OrganisationLogoRenderer,
        cellRendererParams: {
            idField: 'custId',
            nameField: 'name',
            imageUrlField: 'imageUrl'
        }
    },
    {
        field: 'toCustomerId',
        headerName: 'Customer ID',
        filter: "agMultiColumnFilter",
        cellRenderer: OrganisationLogoRenderer,
        cellRendererParams: {
            idField: 'custId',
            nameField: 'name',
            imageUrlField: 'imageUrl'
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

