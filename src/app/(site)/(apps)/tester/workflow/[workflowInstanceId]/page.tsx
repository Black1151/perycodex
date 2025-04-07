import React from "react";
import apiClient from "@/lib/apiClient";
import NewWorkflowLayout from "@/app/(site)/(apps)/NewWorkflowLayout";
import { verifySession } from "@/lib/dal";
import { redirect } from "next/navigation";
import { WorkflowStage } from "@/components/Sidebars/WorkflowSidebar/WorkflowSidebar";

export const revalidate = 0;

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
    {
      cache: "no-store",
    },
  );

  const responseData: ApiResponse = await response.json();

  const stages = responseData.resource;

  return (
    <NewWorkflowLayout
      stages={stages}
      layout={"tester"}
      workflowInstanceId={workflowInstanceId}
    />
  );
}
