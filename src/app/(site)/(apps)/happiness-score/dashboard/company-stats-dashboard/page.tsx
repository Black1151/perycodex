import { redirect } from "next/navigation";
import { getFilteredDashboards } from "@/lib/dashboardUtils";
import WorkflowEngine from "@/app/(site)/(apps)/WorkflowEngine";
import ToolDashboardLayout from "@/app/(site)/(apps)/ToolDashboardLayout";
import DashboardHeader from "@/app/(site)/(apps)/DashboardHeader";
import { verifySession } from "@/lib/dal";
import CompanyStats from "@/app/(site)/(apps)/happiness-score/dashboard/company-stats-dashboard/CompanyStats";
import { checkToolAccess } from "@/lib/tool";
import AccessDenied from "@/components/AccessDenied";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await verifySession();

  if (!session) {
    redirect("/login");
  }

  const toolId = searchParams.toolId as string;
  const workflowId = searchParams.wfId as string;

  if (!workflowId || !toolId) {
    return redirect("/");
  }

  const hasAccess = await checkToolAccess(toolId);
  if (!hasAccess) return <AccessDenied />;

  return (
    <WorkflowEngine toolId={toolId} workflowId={workflowId}>
      <CompanyStats />
    </WorkflowEngine>
  );
}
