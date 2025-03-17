import React from "react";
import apiClient from "@/lib/apiClient";
import WorkflowLayout from "@/app/(site)/(apps)/WorkflowLayout";
import { verifySession } from "@/lib/dal";
import { redirect } from "next/navigation";
import { WorkflowStage } from "@/components/Sidebars/WorkflowSidebar/WorkflowSidebar";

interface ApiResponse {
  resource: WorkflowStage[];
}

export default async function ENPSWorkflowPage({
  params,
}: {
  params: { workflowInstanceId: string };
}) {
  const session = await verifySession();

  // If there's no session, redirect to log in
  if (!session) {
    redirect("/login");
  }

  const workflowInstanceId = params.workflowInstanceId || null;

  // Fetching workflow stages data
  const response = await apiClient(
    `/getAllView?view=vwWorkflowStageInstancesStatus&wfInstId=${workflowInstanceId}`,
  );
  const responseData: ApiResponse = await response.json();
  const stages = responseData.resource;

  // Pass the fetched data to WorkflowLayout
  return (
    <WorkflowLayout
      stages={stages}
      layout={"enps"}
      workflowInstanceId={workflowInstanceId}
    />
  );
}
