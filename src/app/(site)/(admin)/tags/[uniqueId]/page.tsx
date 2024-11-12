import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import { TagDetailsBanner } from "@/components/AdminDetailsBanners/TagDetailsBanner";
import { tagsJson } from "@/components/surveyjs/forms/tags";
import { checkUserRole } from "@/lib/dal";

export default async function TagsDetailPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  await checkUserRole(`/tags/${params.uniqueId}`);

  const res = await apiClient(`/tag/findBy?id=${params.uniqueId}`);

  if (!res.ok) {
    return redirect("/error");
  }

  const tag = await res.json();
  const tagData = tag.resource;

  return (
    <>
      <TagDetailsBanner tag={tagData} />
      <SurveyComponent
        surveyJson={tagsJson}
        endpoint={`/tag/${params.uniqueId}`}
        isNew={false}
        dataset={tagData}
        layout={"default"}
        sjsPath={"admin"}
        reloadPageOnSuccess={true}
      />
    </>
  );
}
