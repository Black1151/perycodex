import { ColDef } from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";

// Updated AgGrids fields for Sites
export const siteFields: ColDef[] | any = [
    {
        field: 'id',
        headerName: 'ID',
        cellDataType: "number",
        filter: "agNumberColumnFilter"
    },
    {
        field: 'siteName',
        headerName: 'Site Name',
        filter: "agTextColumnFilter",
        flex: 2
    },
    {
        field: 'siteTypeName',
        headerName: 'Type',
        filter: "agTextColumnFilter",
        flex: 1
    },
    {
        field: 'address1',
        headerName: 'St. Name',
        filter: "agTextColumnFilter",
        flex: 1
    },
    {
        field: 'postcode',
        headerName: 'Postcode',
        filter: "agTextColumnFilter",
        flex: 1
    },
    {
        field: 'custName',
        headerName: 'Customer',
        filter: "agTextColumnFilter",
        flex: 1
    },
    {
        field: 'isActive',
        headerName: 'Actions',
        flex: 1,
        cellRenderer: ActionButtonRenderer,
        cellRendererParams: {
            redirectUrl: '/sites',
            updateUrl: '/api/site/',
            idField: 'siteUniqueId'
        }
    },
];
