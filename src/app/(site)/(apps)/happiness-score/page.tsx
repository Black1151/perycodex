import WorkflowEngine from "@/app/(site)/(apps)/WorkflowEngine";
import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";
import HappinessDashboardLayout from "@/app/(site)/(apps)/happiness-score/dashboard/HappinessDashboardLayout";
import WorkflowHeader from "@/app/(site)/(apps)/happiness-score/WorkflowHeader";
import { Box, Flex } from "@chakra-ui/react";
import { getUser } from "@/lib/dal";

interface WorkflowInstanceResponse {
  resource: {
    new_wfinstid: string;
  };
}

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

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const toolId = searchParams.toolId as string;
  const workflowId = searchParams.wfId as string;
  const action = searchParams.a as string;
  const user = await getUser();

  if (!workflowId || !toolId) {
    return redirect("/");
  }

  // If action is 1, handle workflow start
  if (action && parseInt(action) === 1) {
    const response = await apiClient(`/startWorkflow`, {
      method: "POST",
      body: JSON.stringify({
        p_wfid: workflowId,
        p_toolid: toolId,
      }),
    });

    if (response.ok) {
      const responseData: WorkflowInstanceResponse = await response.json();
      if (responseData?.resource.new_wfinstid) {
        return redirect(
          `happiness-score/workflow/${responseData.resource.new_wfinstid}`,
        );
      }
    }
  }

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

  // Check response status for both API calls
  if (!dashboardListRes.ok || !toolDataRes.ok) {
    throw new Error("Failed to fetch data");
  }

  const dashboardListData = await dashboardListRes.json();
  const toolConfigData = await toolDataRes.json();

  const dashboardList: Dashboard[] = dashboardListData.resource;
  const toolData = toolConfigData.resource;

  const userRole = user.role; // Extract user role
  const isManager = user.teamManagerCount > 0; // Determine manager status

  // Filter dashboards based on user role and manager status
  const filteredDashboards = dashboardList.filter((dashboard) => {
    // If the dashboard requires a manager and the user is not a manager, exclude it
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
        return true; // Can see all dashboards

      case "CA":
        return true; // Can see all dashboards

      case "CS":
        return (
          dashboard.userRole === "CU" ||
          dashboard.userRole === "CS" ||
          (dashboard.teamManagerRequired &&
            (dashboard.userRole === "CU" || dashboard.userRole === "CS"))
        );

      default:
        return false; // If no role matches, exclude dashboard
    }
  });

  // If there is only one dashboard after filtering, redirect
  if (filteredDashboards.length === 1) {
    const singleDashboard = filteredDashboards[0];
    return redirect(
      `${singleDashboard.dashboardUrl}?toolId=${toolId}&wfId=${workflowId}`,
    );
  }

  return (
    <WorkflowEngine toolId={toolId} workflowId={workflowId}>
      <Flex flex={1} width="100%" mt={"60px"} mb={["60px", "60px", "30px"]}>
        <Box flex={1} overflowY="auto" px={[3, 3, 78]} py={5}>
          <HappinessDashboardLayout dashboardList={filteredDashboards} />
          <WorkflowHeader
            headingText={"Happiness Score"}
            canStartWorkflow={toolData.startInUi}
          />
        </Box>
      </Flex>
    </WorkflowEngine>
  );
}
