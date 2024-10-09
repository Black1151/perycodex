import { ColDef } from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";

export const groupFields: ColDef[] | any = [
    {
        field: 'id',
        headerName: 'ID',
        cellDataType: "number",
        maxWidth: 128,
        minWidth: 64,
        filter: "agNumberColumnFilter"
    },
    {
        field: 'name',
        headerName: 'Group Name',
        filter: "agTextColumnFilter",
        flex: 3
    },
    {
        field: 'description',
        headerName: 'Description',
        filter: "agTextColumnFilter",
        flex: 4
    },
    {
        field: 'customerId',
        headerName: 'Customer ID',
        cellDataType: "number",
        filter: "agNumberColumnFilter",
        flex: 2
    },
    {
        field: 'isActive',
        headerName: 'Active',
        cellDataType: "boolean",
        filter: "agSetColumnFilter",
        flex: 1
    },
    {
        field: 'nothing',
        headerName: 'Actions',
        flex: 1,
        cellRenderer: ActionButtonRenderer,
        cellRendererParams: {
            redirectUrl: '/userGroups'
        }
    },
];
