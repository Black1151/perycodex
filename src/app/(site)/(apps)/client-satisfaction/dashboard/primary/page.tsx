import { redirect } from "next/navigation";
import { getFilteredDashboards } from "@/lib/dashboardUtils";
import WorkflowEngine from "@/app/(site)/(apps)/WorkflowEngine";
import ToolDashboardLayout from "@/app/(site)/(apps)/ToolDashboardLayout";
import DashboardHeader from "@/app/(site)/(apps)/DashboardHeader";
import { verifySession } from "@/lib/dal";
import ClientSatisfactionDashboard from "./ClientSatisfactionDashboard";
import { checkToolAccess } from "@/lib/tool";
import AccessDenied from "@/components/AccessDenied";

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

  if (!workflowId || !toolId) {
    return redirect("/");
  }

  return (
    <WorkflowEngine toolId={toolId} workflowId={workflowId}>
      <ClientSatisfactionDashboard />
    </WorkflowEngine>
  );
}
