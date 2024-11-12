import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import { optionListJson } from "@/components/surveyjs/forms/optionLists";
import { checkUserRole } from "@/lib/dal";

export default async function OptionListsCreatePage() {
  await checkUserRole("/option-lists/lists/create");

  return (
    <>
      <AdminHeader headingText="Create Option List" />
      <SurveyComponent
        surveyJson={optionListJson}
        endpoint={"/optionList"}
        isNew={true}
        layout={"default"}
        redirectUrl={"/option-lists"}
        sjsPath={"admin"}
      />
    </>
  );
}
