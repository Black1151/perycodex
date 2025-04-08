"use server";

import apiClient from "@/lib/apiClient";
import { WorkflowStage } from "@/components/Sidebars/WorkflowSidebar/WorkflowSidebar";
import { revalidateTag } from "next/cache";

interface ApiResponse {
  resource: WorkflowStage[];
}

interface WorkflowResponse {
  access: boolean;
}

export const getWorkflowStages = async (
  workflowInstanceId: string,
): Promise<WorkflowStage[]> => {
  revalidateTag("workflow");

  const response = await apiClient(
    `/getAllView?view=vwWorkflowStageInstancesStatus&wfInstId=${workflowInstanceId}`,
    {
      cache: "no-store",
      next: { tags: ["workflow"] },
    },
  );

  const responseData: ApiResponse = await response.json();
  return responseData.resource;
};

export const checkUserWorkflowAccess = async (
  workflowInstanceId: string,
): Promise<boolean> => {
  const response = await apiClient("/getUserWorkflowAccess", {
    method: "POST",
    body: JSON.stringify({
      workflowInstanceId,
    }),
  });

  const responseData: WorkflowResponse = await response.json();

  return responseData.access;
};
