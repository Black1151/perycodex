import apiClient from "@/lib/apiClient";
import HappinessDashboardLayout from "@/app/(site)/(apps)/happiness-score/dashboard/HappinessDashboardLayout";
import Dashboard from "@/app/(site)/(apps)/happiness-score/dashboard/test-dashboard/Dashboard";

export default async function TestDashboardPage() {
  let userRole;
  let dashboardItems = [];

  try {
    const res = await apiClient(`/getAllView?view=vwWorkflowDashboardList`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      window.alert("HELP");
    }

    const dashboardData = (await res.json()).resource;

    return (
      <>
        <HappinessDashboardLayout dashboardList={dashboardData} />
        <Dashboard />
      </>
    );
  } catch (err) {}
}
