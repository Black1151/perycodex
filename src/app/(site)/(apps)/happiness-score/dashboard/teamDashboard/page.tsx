import apiClient from "@/lib/apiClient";
import HappinessDashboardLayout from "@/app/(site)/(apps)/happiness-score/dashboard/HappinessDashboardLayout";

export default async function Home() {
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

    return <HappinessDashboardLayout dashboardList={dashboardData} />;
  } catch (err) {}
}
