import { redirect } from "next/navigation";
import { getFilteredDashboards } from "@/lib/dashboardUtils";
import WorkflowEngine from "@/app/(site)/(apps)/WorkflowEngine";
import HappinessDashboardLayout from "@/app/(site)/(apps)/happiness-score/dashboard/HappinessDashboardLayout";
import DashboardHeader from "@/app/(site)/(apps)/DashboardHeader";
import StaffDashboardPage from "@/app/(site)/(apps)/happiness-score/dashboard/staff-dashboard/StaffDashboardPage";
import { verifySession } from "@/lib/dal";

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
      "/happiness-score/dashboard/staff-dashboard"
    );

  if (redirectPath) {
    return redirect(redirectPath);
  }

  return (
    <WorkflowEngine toolId={toolId} workflowId={workflowId}>
      <HappinessDashboardLayout dashboardList={filteredDashboards} />
      <DashboardHeader
        headingText={
          activeDashboardName ? activeDashboardName : "Staff Dashboard"
        }
        canStartWorkflow={toolData.startInUi}
      />
      <StaffDashboardPage />
    </WorkflowEngine>
  );
}
