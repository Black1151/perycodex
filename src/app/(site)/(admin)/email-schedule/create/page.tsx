import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import { emailScheduleJson } from "@/components/surveyjs/forms/emailSchedule";
import { checkUserRole } from "@/lib/dal";

export default async function EmailTemplateCreatePage() {
  await checkUserRole("/email-schedule/create");

  return (
    <>
      <AdminHeader headingText="Create Email Schedule" />
      <SurveyComponent
        surveyJson={emailScheduleJson}
        endpoint={`/emailSchedule`}
        isNew={true}
        layout={"default"}
        redirectUrl={"/email-schedule"}
        sjsPath={"admin"}
        cssPath={"admin"}
      />
    </>
  );
}
