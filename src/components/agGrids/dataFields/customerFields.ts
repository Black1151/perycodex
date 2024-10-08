import { ColDef } from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonsRenderer";
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
        flex: 2,
    },
    {
        field: 'country',
        headerName: 'Country',
        filter: "agMultiColumnFilter",
        flex: 1,
    },
    {
        field: 'numberOfEmployees',
        headerName: '# of Employees',
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
            updateUrl: '/api/customer/'
        }
    },
];