import React from "react";
import { verifySession } from "@/lib/dal";
import { redirect } from "next/navigation";
import { WorkflowStage } from "@/components/Sidebars/WorkflowSidebar/WorkflowSidebar";
import NewWorkflowLayout from "@/app/(site)/(apps)/NewWorkflowLayout";
import {
  checkUserWorkflowAccess,
  getWorkflowStages,
} from "@/utils/functions/workflow";

export default async function ClientSatisfactionWorkflowPage({
  params,
}: {
  params: { workflowInstanceId: string };
}) {
  const session = await verifySession();

  const workflowInstanceId = params.workflowInstanceId;

  if (!session || !workflowInstanceId) {
    redirect("/login");
  }

  const hasAccess = await checkUserWorkflowAccess(workflowInstanceId);
  const stages = await getWorkflowStages(workflowInstanceId);

  return (
    <NewWorkflowLayout
      stages={stages}
      layout={"client-satisfaction"}
      workflowInstanceId={workflowInstanceId}
      hasAccess={hasAccess}
    />
  );
}
