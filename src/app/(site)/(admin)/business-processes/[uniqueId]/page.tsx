import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import { businessProcessJson } from "@/components/surveyjs/forms/businessProcess";
import { BusinessProcessDetailsBanner } from "@/components/AdminDetailsBanners/BusinessProcessDetailsBanner";
import { checkUserRole } from "@/lib/dal";

export default async function BusinessProcessesDetailPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  await checkUserRole(`/business-processes/${params.uniqueId}`);

  const res = await apiClient(`/businessProcess/findBy?id=${params.uniqueId}`);

  if (!res.ok) {
    return redirect("/error");
  }

  const businessProcess = await res.json();
  const businessProcessData = businessProcess.resource;

  return (
    <>
      <BusinessProcessDetailsBanner businessProcess={businessProcessData} />
      <SurveyComponent
        surveyJson={businessProcessJson}
        endpoint={`/businessProcess/${params.uniqueId}`}
        isNew={false}
        dataset={businessProcessData}
        layout={"default"}
        sjsPath={"admin"}
        cssPath={"admin"}
        reloadPageOnSuccess={true}
      />
    </>
  );
}
