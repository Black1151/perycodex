import {ColDef} from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";

export const optionListGroupsFields: ColDef[] | any = [
    {headerName: "ID", field: "id", sortable: true, filter: true},
    {headerName: "Name", field: "name", sortable: true, filter: true},
    {headerName: "Description", field: "description", sortable: true, filter: true},
    {headerName: "Customer ID", field: "customerId", sortable: true, filter: true},
    {headerName: "Created At", field: "createdAt", sortable: true, filter: true},
    {headerName: "Updated At", field: "updatedAt", sortable: true, filter: true},
    {
        field: 'isActive',
        headerName: '',
        cellRenderer: ActionButtonRenderer,
        cellRendererParams: {
            redirectUrl: '/option-lists/groups',
            updateUrl: '/api/surveyjs/test',
            idField: 'id',
        }
    },
];