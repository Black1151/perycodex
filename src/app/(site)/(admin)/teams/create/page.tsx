import { userTeamJson } from "@/components/surveyjs/forms/userTeam";
import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import { checkUserRole } from "@/lib/dal";

export default async function TeamsCreatePage() {
  await checkUserRole(`/teams/create`);

  return (
    <>
      <AdminHeader headingText={"Create Department / Team"} />
      <SurveyComponent
        surveyJson={userTeamJson}
        endpoint={"/userTeam"}
        isNew={true}
        redirectUrl={"/teams"}
        sjsPath={"admin"}
      />
    </>
  );
}
