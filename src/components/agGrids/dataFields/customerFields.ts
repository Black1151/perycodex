import {ColDef} from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";
import OrganisationLogoRenderer from "@/components/agGrids/CellRenderers/OrganisationLogoRenderer";

// Updated AgGrids fields
export const customerFields: ColDef[] | any = [
    {
        field: 'name',
        headerName: 'Name',
        filter: "agMultiColumnFilter",
        flex: 2,
        cellRenderer: OrganisationLogoRenderer,
    },
    {
        field: 'customerCode',
        headerName: 'Customer Code',
        filter: "agMultiColumnFilter",
        flex: 1,
    },
    {
        field: 'address3',
        headerName: 'City',
        filter: "agMultiColumnFilter",
        flex: 1,
    },
    {
        field: 'country',
        headerName: 'Country',
        filter: "agMultiColumnFilter",
        flex: 1,
    },
    {
        field: 'noOfUsers',
        headerName: '# Users',
        filter: "agNumberColumnFilter",
        flex: 1,
    },
    {
        field: 'sectorName',
        headerName: 'Sector',
        filter: "agMultiColumnFilter",
        flex: 1,
    },
    {
        field: 'customerType',
        headerName: 'Customer Type',
        filter: "agMultiColumnFilter",
        flex: 1,
    },
    {
        field: 'isActive',
        headerName: '',
        flex: 1,
        cellRenderer: ActionButtonRenderer,
        cellRendererParams: {
            redirectUrl: '/customers',
            updateUrl: '/api/customer/',
            idField: 'custId',
        }
    },
];

