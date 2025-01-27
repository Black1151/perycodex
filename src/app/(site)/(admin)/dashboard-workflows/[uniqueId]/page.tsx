import { DashboardWorkflowDetailsBanner } from "@/components/AdminDetailsBanners/DashboardWorkflowBanner";
import { dashboardWorkflowJson } from "@/components/surveyjs/forms/dashboardWorkflow";
import { redirect } from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import { checkUserRole } from "@/lib/dal";
import apiClient from "@/lib/apiClient";

export default async function DashboardWorkflowDetailsPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  await checkUserRole(`/dashboard-workflows/${params.uniqueId}`);

  const res = await apiClient(
    `/dashboardWorkflow/findBy?id=${params.uniqueId}`,
  );

  if (!res.ok) {
    return redirect("/error");
  }

  const dashboardWorkflow = await res.json();
  const dashboardWorkflowData = dashboardWorkflow.resource;

  return (
    <div>
      <DashboardWorkflowDetailsBanner
        dashboardWorkflow={dashboardWorkflowData}
      />
      <SurveyComponent
        surveyJson={dashboardWorkflowJson}
        endpoint={`/dashboardWorkflow/${params.uniqueId}`}
        isNew={false}
        rolesCanEdit={["PA"]}
        dataset={dashboardWorkflowData}
        excludeKeys={["imageUrl"]}
        layout={"default"}
        sjsPath={"admin"}
        cssPath={"admin"}
        reloadPageOnSuccess={true}
      />
    </div>
  );
}
