import {ColDef} from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";
import OrganisationLogoRenderer from "@/components/agGrids/CellRenderers/OrganisationLogoRenderer";
import UserImageRenderer from "@/components/agGrids/CellRenderers/UserImageRenderer";

// Updated AgGrids fields for Sites
export const siteFields: ColDef[] | any = [
    {
        field: 'id',
        headerName: 'ID',
        cellDataType: "number",
        filter: "agNumberColumnFilter",
        maxWidth: 128,
        minWidth: 64,
        // flex: 1,
    },
    {
        field: 'siteName',
        headerName: 'Site Name',
        filter: "agMultiColumnFilter",
        // flex: 1
    },
    {
        field: 'siteTypeName',
        headerName: 'Type',
        filter: "agMultiColumnFilter",
        // flex: 1
    },
    {
        field: 'address1',
        headerName: 'St. Name',
        filter: "agMultiColumnFilter",
        // flex: 1
    },
    {
        field: 'address3',
        headerName: 'City',
        filter: "agMultiColumnFilter",
        // flex: 1
    },
    {
        field: 'postcode',
        headerName: 'Postcode',
        filter: "agMultiColumnFilter",
        // flex: 1
    },
    {
        field: 'custName',
        headerName: 'Customer',
        filter: "agMultiColumnFilter",
        // flex: 1,
        cellRenderer: OrganisationLogoRenderer,
        cellRendererParams: {
            idField: 'custUniqueId',
            nameField: 'custName',
            imageUrlField: 'custImageUrl',
        }
    },
    {
        field: 'primaryContactFullName',
        headerName: 'Primary Contact',
        filter: "agMultiColumnFilter",
        // flex: 1,
        cellRenderer: UserImageRenderer,
        cellRendererParams: {
            uniqueIdField: 'primaryContactUniqueId',
            nameField: 'primaryContactFullName',
            imageUrlField: 'primaryContactImageUrl',
        }
    },
    {
        field: 'isActive',
        headerName: 'Actions',
        // flex: 1,
        cellRenderer: ActionButtonRenderer,
        cellRendererParams: {
            redirectUrl: '/sites',
            updateUrl: '/api/site/',
            idField: 'siteUniqueId'
        }
    },
];
