import {ColDef} from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";
import OrganisationLogoRenderer from "@/components/agGrids/CellRenderers/OrganisationLogoRenderer";

// Updated AgGrids fields
export const emailTemplateFields: ColDef[] | any = [
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
        field: 'subject',
        headerName: 'Subject',
        filter: "agMultiColumnFilter",
    },
    {
        field: 'isActionable',
        headerName: 'Actionable',
        filter: "agMultiColumnFilter",
    },
    {
        field: 'actionType',
        headerName: 'Action Type',
        filter: "agMultiColumnFilter",
    },
    {
        field: 'isActive',
        headerName: '',
        cellRenderer: ActionButtonRenderer,
        cellRendererParams: {
            redirectUrl: '/email-template',
            updateUrl: '/api/emailTemplate/',
            idField: 'id',
        }
    },
];

