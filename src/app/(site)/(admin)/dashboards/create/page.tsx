import { dashboardJson } from "@/components/surveyjs/forms/dashboard";
import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import { checkUserRole, getUser } from "@/lib/dal";

export default async function DashboardsCreatePage() {
  await checkUserRole(`/dashboards/create`);

  let headerTitle = "Create Dashboard";

  return (
    <>
      <AdminHeader headingText={headerTitle} />
      <SurveyComponent
        surveyJson={dashboardJson}
        endpoint={"/dashboard"}
        isNew={true}
        layout={"default"}
        redirectUrl={"/dashboards"}
        sjsPath={"admin"}
      />
    </>
  );
}
