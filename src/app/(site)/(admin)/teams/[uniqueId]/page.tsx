import { redirect } from "next/navigation";
import { userTeamJson } from "@/components/surveyjs/forms/userTeam";
import { UserTeamDetailsBanner } from "@/components/AdminDetailsBanners/UserTeamDetailsBanner";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import apiClient from "@/lib/apiClient";
import { checkUserRole } from "@/lib/dal";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import { userTeamMembersListFields } from "@/components/agGrids/dataFields/userTeamMembersListFields";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React from "react";

export default async function TeamsDetailPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  await checkUserRole(`/teams/${params.uniqueId}`);

  const [userTeamDetailsRes, userTeamMembersRes] = await Promise.all([
    apiClient(`/userTeam/findBy?uniqueId=${params.uniqueId}`),
    apiClient(
      `/getAllView?view=vwUserTeamMembersList&userTeamUniqueId=${params.uniqueId}`,
    ),
  ]);

  if (!userTeamDetailsRes.ok || !userTeamMembersRes.ok) {
    return redirect("/error");
  }

  const userTeam = await userTeamDetailsRes.json();
  const userTeamMembers = await userTeamMembersRes.json();

  const userTeamData = userTeam?.resource;
  const userTeamMembersData = userTeamMembers?.resource;

  return (
    <>
      <UserTeamDetailsBanner team={userTeamData} />
      <Tabs variant="enclosed" size="md" isFitted>
        <TabList>
          <Tab
            color={"white"}
            fontSize={["sm", "sm", "md"]}
            _selected={{ color: "white", bg: "#FFFFFF44" }}
          >
            {userTeamData.isDepartment ? "Department" : "Team"}
          </Tab>
          <Tab
            color={"white"}
            fontSize={["sm", "sm", "md"]}
            _selected={{ color: "white", bg: "#FFFFFF44" }}
          >
            {userTeamData.isDepartment ? "Department" : "Team"} Members
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <SurveyComponent
              surveyJson={userTeamJson}
              layout={"default"}
              endpoint={`/userTeam/${params.uniqueId}`}
              isNew={false}
              rolesCanEdit={["PA", "CA"]}
              dataset={userTeamData}
              sjsPath={"admin"}
              reloadPageOnSuccess={true}
            />
          </TabPanel>
          <TabPanel p={0}>
            <DataGridComponent
              data={userTeamMembersData}
              initialFields={userTeamMembersListFields}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
