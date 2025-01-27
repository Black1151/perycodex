import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import { businessProcessJson } from "@/components/surveyjs/forms/businessProcess";
import { checkUserRole } from "@/lib/dal";

export default async function BusinessProcessCreatePage() {
  await checkUserRole("/business-processes/create");

  return (
    <>
      <AdminHeader headingText="Create Business Process" />
      <SurveyComponent
        surveyJson={businessProcessJson}
        endpoint={"/businessProcess"}
        isNew={true}
        layout={"default"}
        redirectUrl={"/business-processes"}
        sjsPath={"admin"}
        cssPath={"admin"}
      />
    </>
  );
}
