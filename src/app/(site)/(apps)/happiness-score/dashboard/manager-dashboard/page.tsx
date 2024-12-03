import { redirect } from "next/navigation";
import { getFilteredDashboards } from "@/lib/dashboardUtils";
import WorkflowEngine from "@/app/(site)/(apps)/WorkflowEngine";
import HappinessDashboardLayout from "@/app/(site)/(apps)/happiness-score/dashboard/HappinessDashboardLayout";
import WorkflowHeader from "@/app/(site)/(apps)/happiness-score/WorkflowHeader";
import { verifySession } from "@/lib/dal";
import ManagerDashboardPage from "@/app/(site)/(apps)/happiness-score/dashboard/manager-dashboard/ManagerDashboard";

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
      "/happiness-score/dashboard/manager-dashboard",
    );

  // Redirect to the first dashboard if the user doesn't have access to the current one
  if (redirectPath) {
    return redirect(redirectPath);
  }

  return (
    <WorkflowEngine toolId={toolId} workflowId={workflowId}>
      <HappinessDashboardLayout dashboardList={filteredDashboards} />
      <WorkflowHeader
        headingText={
          activeDashboardName ? activeDashboardName : "Manager Dashboard"
        }
        canStartWorkflow={toolData.startInUi}
      />
      <ManagerDashboardPage isLeaderDashboard={false} />
    </WorkflowEngine>
  );
}
