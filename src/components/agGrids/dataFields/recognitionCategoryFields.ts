import { ColDef } from "ag-grid-community";
import ActionButtonRenderer from "../CellRenderers/ActionButtonRenderer";

export const categoryFields: ColDef[] = [
  {
    field: "name",
    headerName: "Title",
    width: 200,
    filter: "agTextColumnFilter",
  },
  {
    field: "description",
    headerName: "Description",
    width: 300,
    filter: "agTextColumnFilter",
  },
  {
    field: "points",
    headerName: "Points",
    width: 100,
    filter: "agNumberColumnFilter",
  },
  {
    field: "isActive",
    headerName: "Actions",
    cellRenderer: ActionButtonRenderer,
    cellRendererParams: {
      redirectUrl: "/bigup-categories",
      updateUrl: "/api/bigup/isActiveToggle",
      idField: "id",
    },
  },
]; 