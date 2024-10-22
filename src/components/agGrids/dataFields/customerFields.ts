import {ColDef} from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";
import OrganisationLogoRenderer from "@/components/agGrids/CellRenderers/OrganisationLogoRenderer";

// Updated AgGrids fields
export const customerFields: ColDef[] | any = [
    {
        field: "id",
        headerName: "ID",
        filter: "agNumberColumnFilter",
        maxWidth: 128,
        minWidth: 64,
        // flex: 1
    },
    {
        field: 'name',
        headerName: 'Name',
        filter: "agMultiColumnFilter",
        // flex: 2,
        cellRenderer: OrganisationLogoRenderer,
        cellRendererParams: {
            idField: 'custId',
            nameField: 'name',
            imageUrlField: 'imageUrl'
        }
    },
    {
        field: 'customerCode',
        headerName: 'Code',
        filter: "agMultiColumnFilter",
        // flex: 1,
    },
    {
        field: 'address3',
        headerName: 'City',
        filter: "agMultiColumnFilter",
        // flex: 1,
    },
    {
        field: 'countryName',
        headerName: 'Country',
        filter: "agMultiColumnFilter",
        // flex: 1,
    },
    {
        field: 'noOfUsers',
        headerName: '# Users',
        filter: "agNumberColumnFilter",
        // flex: 1,
    },
    {
        field: 'noOfSites',
        headerName: '# Sites',
        filter: "agNumberColumnFilter",
        // flex: 1,
    },
    {
        field: 'sectorName',
        headerName: 'Sector',
        filter: "agMultiColumnFilter",
        // flex: 1,
    },
    {
        field: 'customerType',
        headerName: 'Customer Type',
        filter: "agMultiColumnFilter",
        // flex: 1,
    },
    {
        field: 'isActive',
        headerName: '',
        // flex: 1,
        cellRenderer: ActionButtonRenderer,
        cellRendererParams: {
            redirectUrl: '/customers',
            updateUrl: '/api/customer/',
            idField: 'custId',
        }
    },
];

