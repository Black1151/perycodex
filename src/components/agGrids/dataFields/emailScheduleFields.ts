import {ColDef} from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";
import OrganisationLogoRenderer from "@/components/agGrids/CellRenderers/OrganisationLogoRenderer";

// Updated AgGrids fields
export const emailScheduleFields: ColDef[] | any = [
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
        field: 'frequency',
        headerName: 'Frequency',
        filter: "agMultiColumnFilter",
    },
    {
        field: 'startDate',
        headerName: 'Start Date',
        filter: "agMultiColumnFilter",
    },
    {
        field: 'endDate',
        headerName: 'End Date',
        filter: "agMultiColumnFilter",
    },
    {
        field: 'isActive',
        headerName: '',
        cellRenderer: ActionButtonRenderer,
        cellRendererParams: {
            redirectUrl: '/email-schedule',
            updateUrl: '/api/emailSchedule/',
            idField: 'id',
        }
    },
];

