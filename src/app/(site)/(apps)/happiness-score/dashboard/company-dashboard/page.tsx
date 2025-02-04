import { redirect } from "next/navigation";
import { getFilteredDashboards } from "@/lib/dashboardUtils";
import WorkflowEngine from "@/app/(site)/(apps)/WorkflowEngine";
import ToolDashboardLayout from "@/app/(site)/(apps)/happiness-score/dashboard/ToolDashboardLayout";
import DashboardHeader from "@/app/(site)/(apps)/DashboardHeader";
import { verifySession } from "@/lib/dal";
import ManagerDashboardPage from "@/app/(site)/(apps)/happiness-score/dashboard/company-dashboard/ManagerDashboard";

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

  const { filteredDashboards, toolData, activeDashboardName, redirectPath } =
    await getFilteredDashboards(
      toolId,
      workflowId,
      "/happiness-score/dashboard/company-dashboard",
    );

  if (redirectPath) {
    return redirect(redirectPath);
  }

  return (
    <WorkflowEngine toolId={toolId} workflowId={workflowId}>
      <ToolDashboardLayout dashboardList={filteredDashboards} />
      <DashboardHeader
        headingText={
          activeDashboardName ? activeDashboardName : "Manager Dashboard"
        }
        canStartWorkflow={toolData.startInUi}
        toolUrl={'/happiness-score'}
      />
      <ManagerDashboardPage />
    </WorkflowEngine>
  );
}
