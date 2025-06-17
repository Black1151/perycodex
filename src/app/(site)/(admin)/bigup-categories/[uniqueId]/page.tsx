import { redirect } from "next/navigation";

import apiClient from "@/lib/apiClient";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";
import { recognitionCategoryJson } from "@/components/surveyjs/forms/recognitionCategory";

interface BigUpCategory {
  id: number;
  name: string;
  description: string;
  points: number;
}

export default async function RecognitionCategoryDetailPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  // Fetch BigUp category details
  const categoryRes = await apiClient(
    `/userBigupType/findBy?id=${params.uniqueId}`
  );

  if (!categoryRes.ok) {
    return redirect("/error");
  }

  const category = await categoryRes.json();
  const categoryData: BigUpCategory = category.resource;

  if (!categoryData) {
    return redirect("/error");
  }

  return (
    <>
      <AdminFormWrapper
        formJson={recognitionCategoryJson}
        data={categoryData}
        layoutConfig={{
          layoutKey: "default",
          layoutProps: {},
        }}
        globalVariables={[]}
        stylingConfig={{
          sjsFilePath: "admin",
          cssFilePath: "admin",
        }}
        jsImport={""}
        excludeKeys={["id"]}
        endpoint={`/bigup/${params.uniqueId}`}
        formSuccessMessage={"Category updated successfully"}
        reloadPageOnSuccess={false}
        redirectUrl={"/bigup-categories"}
        isNew={false}
        isAllowedToEdit={true}
      />
    </>
  );
}
