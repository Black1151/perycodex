import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import { EmailScheduleDetailsBanner } from "@/components/AdminDetailsBanners/EmailScheduleDetailsBanner";
import { emailSecureLinkJson } from "@/components/surveyjs/forms/emailSecureLink";
import { checkUserRole } from "@/lib/dal";

export default async function EmailTemplatesDetailPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  await checkUserRole(`/email-secure-link/${params.uniqueId}`);

  const res = await apiClient(`/emailSecureLink/findBy?id=${params.uniqueId}`);

  if (!res.ok) {
    return redirect("/error");
  }

  const emailSecureLink = await res.json();
  const emailSecureLinkData = emailSecureLink.resource;

  return (
    <>
      <EmailScheduleDetailsBanner emailSchedule={emailSecureLinkData} />
      <SurveyComponent
        surveyJson={emailSecureLinkJson}
        endpoint={`/emailSecureLink/${params.uniqueId}`}
        isNew={false}
        dataset={emailSecureLinkData}
        layout={"default"}
        sjsPath={"admin"}
        reloadPageOnSuccess={true}
      />
    </>
  );
}
