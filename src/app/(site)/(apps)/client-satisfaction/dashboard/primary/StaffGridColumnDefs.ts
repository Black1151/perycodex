import {ColDef} from "ag-grid-community";

export const staffCommentsColumnDefs: ColDef[] = [
    {
        headerName: "Staff Name",
        field: "staffName",
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