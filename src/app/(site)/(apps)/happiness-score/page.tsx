import WorkflowEngine from "@/app/(site)/(apps)/WorkflowEngine";
import { redirect } from "next/navigation";
import { getFilteredDashboards } from "@/lib/dashboardUtils";
import NoDashboardsModal from "./NoDashboardModal";
import apiClient from "@/lib/apiClient";
import { verifySession } from "@/lib/dal";

interface WorkflowInstanceResponse {
  resource: {
    new_wfinstid: string;
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await verifySession();

  // If there's no session, redirect to login
  if (!session) {
    redirect("/login");
  }

  const toolId = searchParams.toolId as string;
  const workflowId = searchParams.wfId as string;
  const action = searchParams.a as string;

  if (!workflowId || !toolId) {
    return redirect("/");
  }

  // Handle action logic here
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

  // Fetch filtered dashboards and tool data
  const { filteredDashboards, toolData } = await getFilteredDashboards(
    toolId,
    workflowId,
    "/happiness-score",
  );

  // Redirect if there's only one dashboard
  if (filteredDashboards.length > 0) {
    const singleDashboard = filteredDashboards[0];
    return redirect(
      `${singleDashboard.dashboardUrl}?toolId=${toolId}&wfId=${workflowId}`,
    );
  }

  return (
    <WorkflowEngine toolId={toolId} workflowId={workflowId}>
      {filteredDashboards.length === 0 && <NoDashboardsModal />}
    </WorkflowEngine>
  );
}
