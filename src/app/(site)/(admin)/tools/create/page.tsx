import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import { toolsJson } from "@/components/surveyjs/forms/tools";
import { checkUserRole } from "@/lib/dal";

export default async function ToolsCreatePage() {
  await checkUserRole("/tools/create");

  return (
    <>
      <AdminHeader headingText="Create Tool" />
      <SurveyComponent
        surveyJson={toolsJson}
        endpoint={"/toolConfig"}
        isNew={true}
        layout={"default"}
        redirectUrl={"/tools"}
        sjsPath={"admin"}
        cssPath={"admin"}
      />
    </>
  );
}
