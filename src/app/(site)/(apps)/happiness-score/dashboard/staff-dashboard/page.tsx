import { redirect } from "next/navigation";
import { getFilteredDashboards } from "@/lib/dashboardUtils";
import WorkflowEngine from "@/app/(site)/(apps)/WorkflowEngine";
import HappinessDashboardLayout from "@/app/(site)/(apps)/happiness-score/dashboard/HappinessDashboardLayout";
import WorkflowHeader from "@/app/(site)/(apps)/happiness-score/WorkflowHeader";
import StaffDashboardPage from "@/app/(site)/(apps)/happiness-score/dashboard/staff-dashboard/StaffDashboardPage";
import { verifySession } from "@/lib/dal";

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
  const { filteredDashboards, toolData } = await getFilteredDashboards(
    toolId,
    workflowId,
  );

  return (
    <WorkflowEngine toolId={toolId} workflowId={workflowId}>
      <HappinessDashboardLayout dashboardList={filteredDashboards} />
      <WorkflowHeader
        headingText={"Staff Dashboard"}
        canStartWorkflow={toolData.startInUi}
      />
      <StaffDashboardPage />
    </WorkflowEngine>
  );
}
