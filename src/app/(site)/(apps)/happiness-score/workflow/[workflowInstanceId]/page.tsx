import React from "react";
import apiClient from "@/lib/apiClient";
import WorkflowLayout from "../../../WorkflowLayout";
import { verifySession } from "@/lib/dal";
import { redirect } from "next/navigation";
import { WorkflowStage } from "@/components/Sidebars/WorkflowSidebar/WorkflowSidebar";

// Define the structure of the API response
interface ApiResponse {
  resource: WorkflowStage[];
}

export default async function HappinessScoreWorkflowPage({
  params,
}: {
  params: { workflowInstanceId: string };
}) {
  const session = await verifySession();

  // If there's no session, redirect to login
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
      layout={"happiness"}
      workflowInstanceId={workflowInstanceId}
    />
  );
}
