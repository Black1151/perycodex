import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import { FormDetailsBanner } from "@/components/AdminDetailsBanners/FormDetailsBanner";
import { formsJson } from "@/components/surveyjs/forms/forms";
import { checkUserRole } from "@/lib/dal";

export default async function FormsDetailPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  await checkUserRole(`/forms/${params.uniqueId}`);

  const res = await apiClient(`/form/findBy?id=${params.uniqueId}`);

  if (!res.ok) {
    return redirect("/error");
  }

  const form = await res.json();
  const formData = form.resource;

  return (
    <>
      <FormDetailsBanner form={formData} />
      <SurveyComponent
        surveyJson={formsJson}
        endpoint={`/form/${params.uniqueId}`}
        isNew={false}
        dataset={formData}
        layout={"default"}
        sjsPath={"admin"}
        cssPath={"admin"}
        reloadPageOnSuccess={true}
      />
    </>
  );
}
