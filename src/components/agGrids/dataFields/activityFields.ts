"use client";

import { ColDef } from "ag-grid-community";
import ActivityButtonRenderer from "@/components/agGrids/CellRenderers/ActivityButtonRenderer";
import ToolConfigRenderer from "@/components/agGrids/CellRenderers/ToolConfigRenderer";
import StatusBadgeRenderer from "@/components/agGrids/CellRenderers/StatusBadgeRenderer";
import UserRenderer from "@/components/agGrids/CellRenderers/UserRenderer";

export const activityFields: ColDef[] = [
  {
    field: "wfInstId",
    headerName: "ID",
    filter: "agNumberColumnFilter",
    maxWidth: 98,
    minWidth: 64,
  },
  {
    field: "toolName",
    headerName: "App Name",
    filter: "agTextColumnFilter",
    minWidth: 200,
    cellRenderer: ToolConfigRenderer,
    cellRendererParams: {
      imageUrlField: "toolIconUrl",
      nameField: "toolName",
    },
  },

  {
    field: "wfStarterFullname",
    headerName: "User",
    filter: "agMultiColumnFilter",
    cellRenderer: UserRenderer,
    cellRendererParams: {
      uniqueIdField: "wfStarterUniqueId",
      nameField: "wfStarterFullname",
      imageUrlField: "wfStarterImageUrl",
    },
  },
  {
    field: "wfStarterTeamName",
    headerName: "Team",
    filter: "agMultiColumnFilter",
  },
  {
    field: "wfInstStatusName",
    headerName: "Status",
    filter: "agMultiColumnFilter",
    cellRenderer: StatusBadgeRenderer,
  },
  {
    field: "noStagesPossible",
    headerName: "Possible Stages",
    filter: "agMultiColumnFilter",
  },
  {
    field: "noStagesPending",
    headerName: "Pending Stages",
    filter: "agMultiColumnFilter",
  },
  {
    field: "noStagesStarted",
    headerName: "Started Stages",
    filter: "agMultiColumnFilter",
  },
  {
    field: "noStagesCompleted",
    headerName: "Completed Stages",
    filter: "agMultiColumnFilter",
  },
  {
    field: "wfInstStartDate",
    headerName: "Start Date",
    filter: "agMultiColumnFilter",
  },
  {
    field: "wfInstCompDate",
    headerName: "Complete Date",
    filter: "agMultiColumnFilter",
  },
  {
    field: "isActive",
    headerName: "Actions",
    cellRenderer: ActivityButtonRenderer,
    maxWidth: 150,
  },
];
