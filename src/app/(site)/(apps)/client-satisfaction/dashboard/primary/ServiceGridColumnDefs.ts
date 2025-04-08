import {ColDef} from "ag-grid-community";

export const serviceCommentsColumnDefs: ColDef[] = [
    {
        headerName: "Service Name",
        field: "serviceName",
        sortable: true,
        filter: true,
        resizable: true,
    },
    {
        field: "site",
        headerName: "Site",
        filter: "agMultiColumnFilter",
        chartDataType: "category",
    },
    {
        field: "date",
        headerName: "Date",
    },
    {
        field: "rating",
        headerName: "Rating",
        chartDataType: "category",
    },
    {
        field: "comment",
        headerName: "Comment",
        chartDataType: "category",
    },
];