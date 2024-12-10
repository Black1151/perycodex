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
  deptManagerRequired: boolean;
}

export async function getFilteredDashboards(
  toolId: string,
  workflowId: string,
  pathname: string,
): Promise<{
  filteredDashboards: Dashboard[];
  toolData: any;
  activeDashboardName: string | null;
  redirectPath?: string;
}> {
  const user = await getUser();
  const userRole = user.role;
  const isManagerofDept =
    user.managementRoleIndicator === 1 || user.managementRoleIndicator === 3;
  const isManagerofTeam =
    user.managementRoleIndicator === 2 || user.managementRoleIndicator === 3;

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
    // If the dashboard requires a department manager and the user is not one
    if (dashboard.deptManagerRequired && !isManagerofDept) {
      return false;
    }

    // If the dashboard requires a team manager and the user is not one
    if (dashboard.teamManagerRequired && !isManagerofTeam) {
      return false;
    }

    switch (userRole) {
      case "CU":
        const cuCondition =
          dashboard.userRole === "CU" ||
          (dashboard.teamManagerRequired && dashboard.userRole === "CU") ||
          (dashboard.deptManagerRequired && dashboard.userRole === "CU");

        return cuCondition;

      case "CL":
      case "CA":
        return true;

      case "CS":
        const csCondition =
          dashboard.userRole === "CU" ||
          dashboard.userRole === "CS" ||
          (dashboard.teamManagerRequired &&
            (dashboard.userRole === "CU" || dashboard.userRole === "CS")) ||
          (dashboard.deptManagerRequired &&
            (dashboard.userRole === "CU" || dashboard.userRole === "CS"));

        return csCondition;

      default:
        return false;
    }
  });

  // Find the active dashboard based on the pathname
  const activeDashboard = filteredDashboards.find(
    (dashboard) => dashboard.dashboardUrl === pathname,
  );

  let redirectPath: string | undefined = undefined;

  // If no active dashboard found, redirect to the first filtered dashboard
  if (!activeDashboard && filteredDashboards.length > 0) {
    redirectPath = filteredDashboards[0].dashboardUrl;
  }

  const activeDashboardName = activeDashboard
    ? activeDashboard.dashboardName
    : null;

  return {
    filteredDashboards,
    toolData: toolConfigData.resource,
    activeDashboardName,
    redirectPath,
  };
}
