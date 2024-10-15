'use client';

import {ColDef, ValueFormatterParams} from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";
import OrganisationLogoRenderer from "@/components/agGrids/CellRenderers/OrganisationLogoRenderer";
import UserImageRenderer from "@/components/agGrids/CellRenderers/UserImageRenderer";

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
        flex: 2,
        cellRenderer: OrganisationLogoRenderer,
        cellRendererParams: {
            nameField: 'custName',
            uniqueIdField: 'custUniqueId',
            imageUrlField: 'custImageUrl',
        }
    },
    {
        field: 'parentTeamName',
        headerName: 'Parent Department',
        cellDataType: "text",
        filter: "agMultiColumnFilter",
        flex: 2,
        valueFormatter: (params: ValueFormatterParams) => {
            // Check if parentTeamName exists, otherwise show 'Department'
            return params.value && params.value !== '' ? params.value : 'Department';
        },
    },
    {
        field: 'managerFullname',
        headerName: 'Manager',
        cellDataType: "text",
        filter: "agMultiColumnFilter",
        flex: 2,
        cellRenderer: UserImageRenderer,
        cellRendererParams: {
            nameField: 'managerFullName',
            uniqueIdField: 'managerUniqueId',
            imageUrlField: 'managerImageUrl',
        }
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
