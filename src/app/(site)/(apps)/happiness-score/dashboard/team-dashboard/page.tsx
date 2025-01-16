import { redirect } from "next/navigation";
import { getFilteredDashboards } from "@/lib/dashboardUtils";
import WorkflowEngine from "@/app/(site)/(apps)/WorkflowEngine";
import HappinessDashboardLayout from "@/app/(site)/(apps)/happiness-score/dashboard/HappinessDashboardLayout";
import DashboardHeader from "@/app/(site)/(apps)/DashboardHeader";
import { verifySession } from "@/lib/dal";
import ManagerDashboardPage from "@/app/(site)/(apps)/happiness-score/dashboard/company-dashboard/ManagerDashboard";

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
  const { filteredDashboards, toolData, activeDashboardName, redirectPath } =
    await getFilteredDashboards(
      toolId,
      workflowId,
      "/happiness-score/dashboard/team-dashboard",
    );

  // Redirect to the first dashboard if the user doesn't have access to the current one
  if (redirectPath) {
    return redirect(redirectPath);
  }

  return (
    <WorkflowEngine toolId={toolId} workflowId={workflowId}>
      <HappinessDashboardLayout dashboardList={filteredDashboards} />
      <DashboardHeader
        headingText={
          activeDashboardName ? activeDashboardName : "Team Dashboard"
        }
        canStartWorkflow={toolData.startInUi}
      />
      <ManagerDashboardPage preFilter={"teams"} />
    </WorkflowEngine>
  );
}
