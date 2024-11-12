import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import { EmailTemplateDetailsBanner } from "@/components/AdminDetailsBanners/EmailTemplateDetailsBanner";
import { emailTemplateJson } from "@/components/surveyjs/forms/emailTemplate";
import { checkUserRole } from "@/lib/dal";

export default async function EmailTemplatesDetailPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  await checkUserRole(`/email-template/${params.uniqueId}`);

  const res = await apiClient(`/emailTemplate/findBy?id=${params.uniqueId}`);

  if (!res.ok) {
    return redirect("/error");
  }

  const emailTemplate = await res.json();
  const emailTemplateData = emailTemplate.resource;

  return (
    <>
      <EmailTemplateDetailsBanner emailTemplate={emailTemplateData} />
      <SurveyComponent
        surveyJson={emailTemplateJson}
        endpoint={`/emailTemplate/${params.uniqueId}`}
        isNew={false}
        dataset={emailTemplateData}
        layout={"default"}
        sjsPath={"admin"}
        reloadPageOnSuccess={true}
      />
    </>
  );
}
