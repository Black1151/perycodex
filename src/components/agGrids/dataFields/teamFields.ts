import {ColDef} from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";

export const teamFields: ColDef[] | any = [
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
        headerName: 'Name',
        filter: "agMultiColumnFilter",
        flex: 3
    },
    {
        field: 'custName',
        headerName: 'Customer',
        cellDataType: "text",
        filter: "agMultiColumnFilter",
        flex: 2
    },
    {
        field: 'parentTeamName',
        headerName: 'Parent Team',
        cellDataType: "text",
        filter: "agMultiColumnFilter",
        flex: 2
    },
    {
        field: 'managerFullname',
        headerName: 'Manager',
        cellDataType: "text",
        filter: "agMultiColumnFilter",
        flex: 2
    },
    {
        field: 'isActive',
        headerName: 'Actions',
        flex: 1,
        cellRenderer: ActionButtonRenderer,
        cellRendererParams: {
            redirectUrl: '/teams',
            updateUrl: '/api/userTeam/',
            idField: 'userTeamUniqueId',
        }
    },
];
