import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import { optionListItemsJson } from "@/components/surveyjs/forms/optionListItems";
import { checkUserRole } from "@/lib/dal";

export default async function OptionListItemsCreatePage() {
  await checkUserRole("/option-lists/items/create");

  return (
    <>
      <AdminHeader headingText="Create Option List Item" />
      <SurveyComponent
        surveyJson={optionListItemsJson}
        endpoint={"/optionListItem"}
        isNew={true}
        layout={"default"}
        redirectUrl={"/option-lists"}
        sjsPath={"admin"}
      />
    </>
  );
}
