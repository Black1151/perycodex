import {ColDef} from "ag-grid-community";
import UserRenderer from "@/components/agGrids/CellRenderers/UserRenderer";
import ScoreRenderer from "@/components/agGrids/CellRenderers/ClientSatisfaction/ScoreRenderer";
import { dateValueFormatter } from "@/components/agGrids/ValueFormatters/dateValueFormatter";
import CommentsCellRenderer from "@/components/agGrids/CellRenderers/CommentsCellRenderer";

export const checkoutColumnDefs: ColDef[] = [
    {
        headerName: "Product Name",
        field: "name",
        sortable: true,
        filter: true,
        resizable: true,
    },
];