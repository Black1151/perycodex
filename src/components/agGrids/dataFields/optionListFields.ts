import {ColDef} from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";

export const optionListFields: ColDef[] | any = [
    {
        field: 'id',
        headerName: 'ID',
        cellDataType: "number",
        maxWidth: 128,
        minWidth: 64,
        filter: "agNumberColumnFilter"
    },
    {field: 'name', filter: "agMultiColumnFilter", headerName: 'List Name'},
    {field: 'description', filter: "agMultiColumnFilter", flex: 3},
    {field: 'optionListItemsCount', type: 'numericColumn', filter: "agNumberColumnFilter"},
    {
        field: 'isActive',
        headerName: 'Actions',
        cellRenderer: ActionButtonRenderer,
        filter: false,
        cellRendererParams: {
            redirectUrl: '/option-lists',
            updateUrl: '/api/optionList/',
            idField: 'id',
        },
        maxWidth: 128,
    },
];