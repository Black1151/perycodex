import apiClient from "@/lib/apiClient";
import { getUser } from "@/lib/dal";

export interface Dashboard {
  dashboardId: number;
  dashboardName: string;
  workflowId: number;
  userRole: string;
  userAccessGroupNames?: string;
  dashboardUrl: string;
  smallIconImageUrl?: string;
  largeIconImageUrl?: string;
  dashboardOrder: number;
  availableAs: string;
  teamManagerRequired: boolean;
}

export async function getFilteredDashboards(
  toolId: string,
  workflowId: string,
): Promise<{ filteredDashboards: Dashboard[]; toolData: any }> {
  const user = await getUser();
  const userRole = user.role;
  const isManager = user.teamManagerCount > 0;

  const [dashboardListRes, toolDataRes] = await Promise.all([
    apiClient(
      `/getAllView?view=vwWorkflowDashboardList&workflowId=${workflowId}`,
      {
        method: "GET",
        cache: "no-store",
      },
    ),
    apiClient(`/getView?view=vwToolsWorkflowList&toolId=${toolId}`, {
      method: "GET",
      cache: "no-store",
    }),
  ]);

  if (!dashboardListRes.ok || !toolDataRes.ok) {
    throw new Error("Failed to fetch data");
  }

  const dashboardListData = await dashboardListRes.json();
  const toolConfigData = await toolDataRes.json();

  const dashboardList: Dashboard[] = dashboardListData.resource;

  // Filter dashboards based on user role and manager status
  const filteredDashboards = dashboardList.filter((dashboard) => {
    if (dashboard.teamManagerRequired && !isManager) {
      return false;
    }

    switch (userRole) {
      case "CU":
        return (
          dashboard.userRole === "CU" ||
          (dashboard.teamManagerRequired && dashboard.userRole === "CU")
        );
      case "CL":
      case "CA":
        return true;
      case "CS":
        return (
          dashboard.userRole === "CU" ||
          dashboard.userRole === "CS" ||
          (dashboard.teamManagerRequired &&
            (dashboard.userRole === "CU" || dashboard.userRole === "CS"))
        );
      default:
        return false;
    }
  });

  return {
    filteredDashboards,
    toolData: toolConfigData.resource,
  };
}
