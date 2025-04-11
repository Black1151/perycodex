import {ColDef} from "ag-grid-community";
import UserRenderer from "@/components/agGrids/CellRenderers/UserRenderer";
import ScoreRenderer from "@/components/agGrids/CellRenderers/ClientSatisfaction/ScoreRenderer";
import { dateValueFormatter } from "@/components/agGrids/ValueFormatters/dateValueFormatter";

export const servicesCommentsColumnDefs: ColDef[] = [
    {
        headerName: "Service",
        field: "serviceName",
        sortable: true,
        filter: true,
        resizable: true,
        rowGroup: true,
    },
    {
        field: "date",
        headerName: "Date",
        valueFormatter: (params) => dateValueFormatter(params.value),
    },
    {
        field: "site",
        headerName: "Site",
        filter: "agMultiColumnFilter",
        chartDataType: "category",
    },
    {
        field: "clientName",
        headerName: "Client Name",
        filter: "agMultiColumnFilter",
        chartDataType: "category",
        cellRenderer: UserRenderer,
        cellRendererParams: {
            nameField: "clientName",
          },
    },
    {
        field: "rating",
        headerName: "Rating",
        chartDataType: "category",
        cellRenderer: ScoreRenderer,
        cellRendererParams: {
            score: "rating",
          },
    },
    {
        field: "comment",
        headerName: "Comment",
        chartDataType: "category",
    },
];