import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import { selectItemsJson } from "@/components/surveyjs/forms/selectItems";
import { checkUserRole } from "@/lib/dal";

export default async function OptionListsCreatePage() {
  await checkUserRole("/select-items/create");

  return (
    <>
      <AdminHeader headingText="Create Select Item" />
      <SurveyComponent
        surveyJson={selectItemsJson}
        endpoint={"/selectItem"}
        isNew={true}
        layout={"default"}
        redirectUrl={"/select-items"}
        sjsPath={"admin"}
      />
    </>
  );
}
