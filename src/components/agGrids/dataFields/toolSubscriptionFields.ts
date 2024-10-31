'use client';

import {ColDef, ValueFormatterParams} from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";
import ToolConfigRenderer from "@/components/agGrids/CellRenderers/ToolConfigRenderer";
import OrganisationLogoRenderer from "@/components/agGrids/CellRenderers/OrganisationLogoRenderer";
import {currencyFormatter} from "@/components/agGrids/ValueFormatters/currencyFormatter";

export const toolSubscriptionFields: ColDef[] = [
    {
        field: "id",
        headerName: "ID",
        filter: "agNumberColumnFilter",
        maxWidth: 100,
        minWidth: 60,
        sortable: true,
    },
    {
        field: "toolName",
        headerName: "Tool Name",
        filter: "agMultiColumnFilter",
        cellRenderer: ToolConfigRenderer,
        cellRendererParams: {
            'uniqueIdField': 'toolId',
            'imageUrlField': 'toolIconImageUrl',
            'nameField': 'toolName'
        }
    },
    {
        field: "customerName",
        headerName: "Customer",
        filter: "agMultiColumnFilter",
        cellRenderer: OrganisationLogoRenderer,
        cellRendererParams: {
            'idField': 'custUniqueId',
            'imageUrlField': 'custImageUrl',
            'nameField': 'custName'
        },
    },
    {
        field: "subTypeName",
        headerName: "Subscription Type",
        filter: "agMultiColumnFilter",
    },
    {
        field: "subStartDate",
        headerName: "Subscription Start Date",
        filter: "agDateColumnFilter",
    },
    {
        field: "price",
        headerName: "Price (£)",
        filter: "agNumberColumnFilter",
        type: "rightAligned",
        valueFormatter: (params: ValueFormatterParams) => {
            return currencyFormatter(params.value);
        }
    },
    {
        field: "isActive",
        headerName: "Actions",
        cellRenderer: ActionButtonRenderer,
        cellRendererParams: {
            redirectUrl: "/tool-subscriptions",
            updateUrl: "/api/toolCustomer/",
            idField: "id",
        },
    },
];
