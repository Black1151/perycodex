import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import { workflowJson } from "@/components/surveyjs/forms/workflows";
import { checkUserRole } from "@/lib/dal";

export default async function WorkflowsCreatePage() {
  await checkUserRole("/workflows/create");

  return (
    <>
      <AdminHeader headingText="Create Workflow" />
      <SurveyComponent
        surveyJson={workflowJson}
        endpoint={"/workflow"}
        isNew={true}
        layout={"default"}
        redirectUrl={"/workflows"}
        sjsPath={"admin"}
      />
    </>
  );
}
