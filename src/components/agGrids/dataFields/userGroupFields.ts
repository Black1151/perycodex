import {ColDef} from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";
import OrganisationLogoRenderer from "@/components/agGrids/CellRenderers/OrganisationLogoRenderer";

export const groupFields: ColDef[] | any = [
    {
        field: 'id',
        headerName: 'ID',
        cellDataType: "number",
        filter: "agNumberColumnFilter",
        maxWidth: 128,
        minWidth: 64,
        flex: 1
    },
    {
        field: 'name',
        headerName: 'Group Name',
        filter: "agMultiColumnFilter",
        flex: 1
    },
    {
        field: 'description',
        headerName: 'Description',
        filter: "agMultiColumnFilter",
        flex: 3
    },
    {
        field: 'custName',
        headerName: 'Customer',
        filter: "agMultiColumnFilter",
        flex: 2,
        cellRenderer: OrganisationLogoRenderer,
        cellRendererParams: {
            nameField: 'custName',
            uniqueIdField: 'custUniqueId',
            imageUrlField: 'custImageUrl',
        }
    },
    {
        field: 'isActive',
        headerName: 'Actions',
        flex: 1,
        cellRenderer: ActionButtonRenderer,
        cellRendererParams: {
            redirectUrl: '/user-groups',
            updateUrl: '/api/userGroup/',
            idField: 'uniqueId',
        }
    },
];
