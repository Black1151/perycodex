import { redirect } from "next/navigation";
import { userTeamJson } from "@/components/surveyjs/forms/userTeam";
import { UserTeamDetailsBanner } from "@/components/AdminDetailsBanners/UserTeamDetailsBanner";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import apiClient from "@/lib/apiClient";
import { checkUserRole } from "@/lib/dal";

export default async function TeamsDetailPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  await checkUserRole(`/teams/${params.uniqueId}`);

  const res = await apiClient(`/userTeam/findBy?uniqueId=${params.uniqueId}`);

  if (!res.ok) {
    return redirect("/error");
  }

  const userTeam = await res.json();
  const userTeamData = userTeam?.resource;

  return (
    <div>
      <UserTeamDetailsBanner team={userTeamData} />
      <SurveyComponent
        surveyJson={userTeamJson}
        endpoint={`/userTeam/${params.uniqueId}`}
        isNew={false}
        dataset={userTeamData}
        sjsPath={"admin"}
        reloadPageOnSuccess={true}
      />
    </div>
  );
}
