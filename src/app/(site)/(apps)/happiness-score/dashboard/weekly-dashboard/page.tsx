import { redirect } from "next/navigation";
import { getFilteredDashboards } from "@/lib/dashboardUtils";
import WorkflowEngine from "@/app/(site)/(apps)/WorkflowEngine";
import HappinessDashboardLayout from "@/app/(site)/(apps)/happiness-score/dashboard/HappinessDashboardLayout";
import WorkflowHeader from "@/app/(site)/(apps)/happiness-score/WorkflowHeader";
import { verifySession } from "@/lib/dal";
import WeeklyDashboard from "@/app/(site)/(apps)/happiness-score/dashboard/weekly-dashboard/WeeklyDashboard";

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

  // Fetch filtered dashboards and tool data
  const { filteredDashboards, toolData, activeDashboardName } =
    await getFilteredDashboards(
      toolId,
      workflowId,
      "/happiness-score/dashboard/weekly-dashboard",
    );

  return (
    <WorkflowEngine toolId={toolId} workflowId={workflowId}>
      <HappinessDashboardLayout dashboardList={filteredDashboards} />
      <WorkflowHeader
        headingText={
          activeDashboardName ? activeDashboardName : "AG Test Dashboard"
        }
        canStartWorkflow={toolData.startInUi}
      />
      <WeeklyDashboard />
    </WorkflowEngine>
  );
}
