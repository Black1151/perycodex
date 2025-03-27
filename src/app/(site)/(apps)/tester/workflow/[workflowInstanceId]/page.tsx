import React from "react";
import apiClient from "@/lib/apiClient";
import WorkflowLayout from "@/app/(site)/(apps)/WorkflowLayout";
import { verifySession } from "@/lib/dal";
import { redirect } from "next/navigation";
import { WorkflowStage } from "@/components/Sidebars/WorkflowSidebar/WorkflowSidebar";

interface ApiResponse {
  resource: WorkflowStage[];
}

export default async function ClientSatisfactionWorkflowPage({
  params,
}: {
  params: { workflowInstanceId: string };
}) {
  const session = await verifySession();

  if (!session) {
    redirect("/login");
  }

  const workflowInstanceId = params.workflowInstanceId || null;

  const response = await apiClient(
    `/getAllView?view=vwWorkflowStageInstancesStatus&wfInstId=${workflowInstanceId}`,
  );

  const responseData: ApiResponse = await response.json();

  const stages = responseData.resource;

  return (
    <WorkflowLayout
      stages={stages}
      layout={"tester"}
      workflowInstanceId={workflowInstanceId}
    />
  );
}
