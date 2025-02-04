import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import { optionListItemsJson } from "@/components/surveyjs/forms/optionListItems";
import { OptionListItemDetailsBanner } from "@/components/AdminDetailsBanners/OptionListItemDetailsBanner";
import { checkUserRole } from "@/lib/dal";

export default async function OptionListItemsDetailPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  await checkUserRole(`/option-lists/items/${params.uniqueId}`);

  const res = await apiClient(`/optionListItem/findBy?id=${params.uniqueId}`);

  if (!res.ok) {
    return redirect("/error");
  }

  const optionListItem = await res.json();
  const optionListItemData = optionListItem.resource;

  return (
    <>
      <OptionListItemDetailsBanner optionListItem={optionListItemData} />
      <SurveyComponent
        surveyJson={optionListItemsJson}
        endpoint={`/optionListItem/${params.uniqueId}`}
        isNew={false}
        layout={"default"}
        dataset={optionListItemData}
        sjsPath={"admin"}
        cssPath={"admin"}
        reloadPageOnSuccess={true}
      />
    </>
  );
}
