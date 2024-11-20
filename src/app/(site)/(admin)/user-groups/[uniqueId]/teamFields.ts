import { ColDef } from "ag-grid-community";
import TeamRenderer from "@/components/agGrids/CellRenderers/TeamRenderer";

export const teamFieldDefs: ColDef[] = [
  {
    headerName: "ID",
    field: "id",
    maxWidth: 128,
    minWidth: 64,
    hide: true,
  },
  {
    headerName: "Team",
    field: "name",
    rowDrag: true,
    cellRenderer: TeamRenderer,
    cellRendererParams: {
      nameField: "name",
    },
  },
];
