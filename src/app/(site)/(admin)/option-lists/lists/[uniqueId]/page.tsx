import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import { OptionListDetailsBanner } from "@/components/AdminDetailsBanners/OptionListDetailsBanner";
import { optionListJson } from "@/components/surveyjs/forms/optionLists";
import { checkUserRole } from "@/lib/dal";

export default async function OptionListsDetailPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  await checkUserRole(`/option-lists/lists/${params.uniqueId}`);

  const res = await apiClient(`/optionList/findBy?id=${params.uniqueId}`);

  if (!res.ok) {
    return redirect("/error");
  }

  const optionList = await res.json();
  const optionListData = optionList.resource;

  return (
    <>
      <OptionListDetailsBanner optionList={optionListData} />
      <SurveyComponent
        surveyJson={optionListJson}
        endpoint={`/optionList/${params.uniqueId}`}
        isNew={false}
        layout={"default"}
        dataset={optionListData}
        sjsPath={"admin"}
        cssPath={"admin"}
        reloadPageOnSuccess={true}
      />
    </>
  );
}
