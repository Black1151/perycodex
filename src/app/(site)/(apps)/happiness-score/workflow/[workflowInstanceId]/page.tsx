import React from "react";
import { verifySession } from "@/lib/dal";
import { redirect } from "next/navigation";
import NewWorkflowLayout from "@/app/(site)/(apps)/NewWorkflowLayout";
import {
  checkUserWorkflowAccess,
  getWorkflowStages,
} from "@/utils/functions/workflow";

export default async function HappinessScoreWorkflowPage({
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
      layout={"happiness"}
      workflowInstanceId={workflowInstanceId}
      hasAccess={hasAccess}
    />
  );
}
