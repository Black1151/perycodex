import { userTeamJson } from "@/components/surveyjs/forms/userTeam";
import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import { checkUserRole, getUser } from "@/lib/dal";
import { redirect } from "next/navigation";

export default async function TeamsCreatePage() {
  const user = await getUser();
  await checkUserRole(`/teams/create`);

  if (!["CA", "PA"].includes(user.role)) {
    return redirect("/");
  }

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
