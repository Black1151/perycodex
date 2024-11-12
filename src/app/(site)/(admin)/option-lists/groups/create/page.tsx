import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import { optionListGroupsJson } from "@/components/surveyjs/forms/optionListGroups";
import { checkUserRole } from "@/lib/dal";

export default async function OptionListGroupsCreatePage() {
  await checkUserRole("/option-lists/groups/create");

  return (
    <>
      <AdminHeader headingText="Create Option List Group" />
      <SurveyComponent
        surveyJson={optionListGroupsJson}
        endpoint={"/optionListGroup"}
        isNew={true}
        layout={"default"}
        redirectUrl={"/option-lists"}
        sjsPath={"admin"}
      />
    </>
  );
}
