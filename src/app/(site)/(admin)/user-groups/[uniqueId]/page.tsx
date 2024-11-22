import { redirect } from "next/navigation";
import { UserGroupDetailsBanner } from "@/components/AdminDetailsBanners/UserGroupDetailsBanner";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import apiClient from "@/lib/apiClient";
import { checkUserRole, getUser } from "@/lib/dal";
import UserGroupsTabs from "@/app/(site)/(admin)/user-groups/[uniqueId]/UserGroupTabs";
import { userGroupJson } from "@/components/surveyjs/forms/userGroup";

export default async function UserGroupsDetailPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  const user = await getUser();
  await checkUserRole(`/user-groups/${params.uniqueId}`);

  // Fetch user group details
  const userGroupRes = await apiClient(
    `/userGroup/findBy?uniqueId=${params.uniqueId}`,
  );

  if (!userGroupRes.ok) {
    return redirect("/error");
  }

  const userGroup = await userGroupRes.json();
  const userGroupData = userGroup.resource;

  if (user.role === "PA") {
    return (
      <>
        <UserGroupDetailsBanner userGroup={userGroupData} />
        <SurveyComponent
          surveyJson={userGroupJson}
          endpoint={`/userGroup/${params.uniqueId}`}
          isNew={false}
          dataset={userGroupData}
          sjsPath={"admin"}
          reloadPageOnSuccess={true}
        />
      </>
    );
  }

  // Fetch additional data for non-PA users
  const userGroupId = userGroupData?.id;
  if (!userGroupId) {
    return redirect("/error");
  }

  const [userPopulationRes, userSampleRes, teamPopulationRes, teamSampleRes] =
    await Promise.all([
      apiClient("/usersGroupManagementList", { method: "POST" }),
      apiClient(`/userGroupMember/allBy?userGroupId=${userGroupId}`),
      apiClient(
        `/userTeam/allBy?parentTeamId=not-null&customerId=${user.customerId}`,
      ),
      apiClient(`/userGroupMember/allBy?userGroupId=${userGroupId}`),
    ]);

  if (!userPopulationRes.ok || !userSampleRes.ok) {
    return redirect("/error");
  }

  const userPopulationData = (await userPopulationRes.json()).resource;
  const userSampleData = (await userSampleRes.json()).resource;
  const teamPopulationData = (await teamPopulationRes.json()).resource;
  const teamSampleData = (await teamSampleRes.json()).resource;

  return (
    <>
      <UserGroupDetailsBanner userGroup={userGroupData} />
      <UserGroupsTabs
        userGroupId={userGroupId}
        userGroupData={userGroupData}
        userPopulationData={userPopulationData}
        userSampleData={userSampleData}
        teamPopulationData={teamPopulationData}
        teamSampleData={teamSampleData}
      />
    </>
  );
}
