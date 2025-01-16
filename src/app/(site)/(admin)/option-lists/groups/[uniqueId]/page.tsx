import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import { OptionListGroupDetailsBanner } from "@/components/AdminDetailsBanners/OptionListGroupDetailsBanner";
import { optionListGroupsJson } from "@/components/surveyjs/forms/optionListGroups";
import { checkUserRole } from "@/lib/dal";

export default async function OptionListGroupsDetailPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  await checkUserRole(`/option-lists/groups/${params.uniqueId}`);

  const res = await apiClient(`/optionListGroup/findBy?id=${params.uniqueId}`);

  if (!res.ok) {
    return redirect("/error");
  }

  const optionListGroup = await res.json();
  const optionListGroupData = optionListGroup.resource;

  return (
    <>
      <OptionListGroupDetailsBanner optionListGroup={optionListGroupData} />
      <SurveyComponent
        surveyJson={optionListGroupsJson}
        endpoint={`/optionListGroup/${params.uniqueId}`}
        isNew={false}
        layout={"default"}
        dataset={optionListGroupData}
        sjsPath={"admin"}
        reloadPageOnSuccess={true}
      />
    </>
  );
}
