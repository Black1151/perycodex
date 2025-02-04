import { DashboardDetailsBanner } from "@/components/AdminDetailsBanners/DashboardBanner";
import { dashboardJson } from "@/components/surveyjs/forms/dashboard";
import { redirect } from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import { checkUserRole } from "@/lib/dal";
import apiClient from "@/lib/apiClient";

export default async function CustomersDetailsPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  await checkUserRole(`/dashboards/${params.uniqueId}`);

  const res = await apiClient(`/dashboard/findBy?id=${params.uniqueId}`);

  if (!res.ok) {
    return redirect("/error");
  }

  const dashboard = await res.json();
  const dashboardData = dashboard.resource;

  return (
    <div>
      <DashboardDetailsBanner dashboard={dashboardData} />
      <SurveyComponent
        surveyJson={dashboardJson}
        endpoint={`/dashboard/${params.uniqueId}`}
        isNew={false}
        rolesCanEdit={["PA"]}
        dataset={dashboardData}
        excludeKeys={["imageUrl"]}
        layout={"default"}
        sjsPath={"admin"}
        cssPath={"admin"}
        reloadPageOnSuccess={true}
      />
    </div>
  );
}
