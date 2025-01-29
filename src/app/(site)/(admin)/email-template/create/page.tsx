import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import { emailTemplateJson } from "@/components/surveyjs/forms/emailTemplate";
import { checkUserRole } from "@/lib/dal";

export default async function EmailTemplateCreatePage() {
  await checkUserRole("/email-template/create");

  return (
    <>
      <AdminHeader headingText="Create Email Template" />
      <SurveyComponent
        surveyJson={emailTemplateJson}
        endpoint={"/emailTemplate"}
        isNew={true}
        layout={"default"}
        redirectUrl={"/email-template"}
        sjsPath={"admin"}
        cssPath={"admin"}
      />
    </>
  );
}
