import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import { emailSecureLinkJson } from "@/components/surveyjs/forms/emailSecureLink";
import { checkUserRole } from "@/lib/dal";

export default async function EmailSecureLinkCreatePage() {
  await checkUserRole("/email-secure-link/create");

  return (
    <>
      <AdminHeader headingText="Create Email Secure Link" />
      <SurveyComponent
        surveyJson={emailSecureLinkJson}
        endpoint={"/emailSecureLink"}
        isNew={true}
        layout={"default"}
        redirectUrl={"/email-secure-link"}
        sjsPath={"admin"}
        cssPath={"admin"}
      />
    </>
  );
}
