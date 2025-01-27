import { dashboardWorkflowJson } from "@/components/surveyjs/forms/dashboardWorkflow";
import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import { checkUserRole } from "@/lib/dal";

export default async function DashboardWorkflowsCreatePage() {
  await checkUserRole(`/dashboard-workflows/create`);

  let headerTitle = "Create Dashboard Workflow";

  return (
    <>
      <AdminHeader headingText={headerTitle} />
      <SurveyComponent
        surveyJson={dashboardWorkflowJson}
        endpoint={"/dashboardWorkflow"}
        isNew={true}
        layout={"default"}
        redirectUrl={"/dashboard-workflows"}
        sjsPath={"admin"}
        cssPath={"admin"}
      />
    </>
  );
}
