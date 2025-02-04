import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import { formsJson } from "@/components/surveyjs/forms/forms";
import { checkUserRole } from "@/lib/dal";

export default async function FormsCreatePage() {
  await checkUserRole("/forms/create");

  return (
    <>
      <AdminHeader headingText="Create Form" />
      <SurveyComponent
        surveyJson={formsJson}
        endpoint={"/form"}
        isNew={true}
        layout={"default"}
        redirectUrl={"/forms"}
        sjsPath={"admin"}
        cssPath={"admin"}
      />
    </>
  );
}
