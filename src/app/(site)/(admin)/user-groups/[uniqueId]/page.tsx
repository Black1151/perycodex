import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { userGroupJson } from "@/components/surveyjs/forms/userGroup";
import { redirect } from "next/navigation";
import { UserGroupDetailsBanner } from "@/components/AdminDetailsBanners/UserGroupDetailsBanner";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import apiClient from "@/lib/apiClient";
import { checkUserRole, getUser } from "@/lib/dal";
import DraggableGridsComponent from "@/components/agGrids/DraggableGridsComponent";
import { ColDef } from "ag-grid-community";
import TeamRenderer from "@/components/agGrids/CellRenderers/TeamRenderer";
import UserRenderer from "@/components/agGrids/CellRenderers/UserRenderer";

export default async function UserGroupsDetailPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  const user = await getUser();
  await checkUserRole(`/user-groups/${params.uniqueId}`);

  // Fetch the user group details first
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
      <Box p={6}>
        {/* User Group Details Banner */}
        <UserGroupDetailsBanner userGroup={userGroupData} />

        <SurveyComponent
          surveyJson={userGroupJson}
          endpoint={`/userGroup/${params.uniqueId}`}
          isNew={false}
          dataset={userGroupData}
          sjsPath={"admin"}
          reloadPageOnSuccess={true}
        />
      </Box>
    );
  }

  if (user.role !== "PA") {
    // Extract the `id` from `userGroupData` for subsequent API calls
    const userGroupId = userGroupData?.id;
    if (!userGroupId) {
      return redirect("/error");
    }

    // Fetch the remaining data using the `id` from the first call
    const [userPopulationRes, userSampleRes, teamPopulationRes, teamSampleRes] =
      await Promise.all([
        apiClient(
          "/user/allBy?selectColumns=id,firstName,lastName,role,email,uniqueId",
        ),
        apiClient(`/userGroupMember/allBy?userGroupId=${userGroupId}`),
        apiClient(
          `/userTeam/allBy?parentTeamId=not-null&customerId=${user.customerId}`,
        ),
        apiClient(`/userGroupMember/allBy?userGroupId=${userGroupId}`),
      ]);

    if (!userPopulationRes.ok || !userSampleRes.ok) {
      return redirect("/error");
    }

    const userPopulationJson = await userPopulationRes.json();
    const userSampleJson = await userSampleRes.json();
    const teamPopulationJson = await teamPopulationRes.json();
    const teamSampleJson = await teamSampleRes.json();

    const userPopulationData = userPopulationJson.resource;
    const userSampleData = userSampleJson.resource;
    const teamPopulationData = teamPopulationJson.resource;
    const teamSampleData = teamSampleJson.resource;

    // Column definitions for Users Members
    const userFieldDefs: ColDef[] = [
      {
        headerName: "ID",
        field: "id",
        maxWidth: 100,
        minWidth: 64,
        rowDrag: true,
      },
      {
        headerName: "First Name",
        field: "firstName",
        cellRenderer: UserRenderer,
        cellRendererParams: {
          uniqueIdField: "uniqueId",
          nameField: "firstName",
          imageUrlField: "imageUrl",
        },
      },
      {
        headerName: "Role",
        maxWidth: 100,
        minWidth: 64,
        field: "role",
      },
      {
        headerName: "Email",
        field: "email",
      },
    ];

    // Column definitions for Team Members
    const teamFieldDefs: ColDef[] = [
      {
        headerName: "ID",
        field: "id",
        maxWidth: 128,
        minWidth: 64,
        rowDrag: true,
      },
      {
        headerName: "Team",
        field: "name",
        cellRenderer: TeamRenderer,
        cellRendererParams: {
          nameField: "name",
          uniqueIdField: "id",
        },
      },
    ];

    return (
      <Box p={6}>
        {/* User Group Details Banner */}
        <UserGroupDetailsBanner userGroup={userGroupData} />

        {/* Render based on responsive view */}
        <Box
          mt={4}
          display={{
            base: "block",
            md: "none",
          }}
        >
          <SurveyComponent
            surveyJson={userGroupJson}
            endpoint={`/userGroup/${params.uniqueId}`}
            isNew={false}
            dataset={userGroupData}
            sjsPath={"admin"}
            reloadPageOnSuccess={true}
          />
        </Box>

        <Box
          display={{
            base: "none",
            md: "block",
          }}
          mt={4}
        >
          <Tabs variant="enclosed" size="md" isFitted>
            <TabList>
              <Tab
                color={"white"}
                fontSize={["sm", "sm", "md"]}
                _selected={{ color: "white", bg: "#FFFFFF44" }}
              >
                Edit User Group
              </Tab>
              <Tab
                color={"white"}
                fontSize={["sm", "sm", "md"]}
                _selected={{ color: "white", bg: "#FFFFFF44" }}
              >
                User Group Members
              </Tab>
              <Tab
                color={"white"}
                fontSize={["sm", "sm", "md"]}
                _selected={{ color: "white", bg: "#FFFFFF44" }}
              >
                Team Group Members
              </Tab>
            </TabList>

            <TabPanels>
              {/* First Tab: Edit User Group */}
              <TabPanel margin={0} p={0} mt={4}>
                <SurveyComponent
                  surveyJson={userGroupJson}
                  endpoint={`/userGroup/${params.uniqueId}`}
                  isNew={false}
                  dataset={userGroupData}
                  sjsPath={"admin"}
                  reloadPageOnSuccess={true}
                />
              </TabPanel>
              {/* Second Tab: User Group Members - Teams */}
              <TabPanel margin={0} p={0} mt={4}>
                <DraggableGridsComponent
                  populationData={userPopulationData}
                  populationTitle={"Users"}
                  sampleData={userSampleData}
                  sampleTitle={"Users in group"}
                  endpoint={`/api/userGroup/many/${userGroupId}`}
                  fieldDefs={userFieldDefs}
                  dynamicIdField={"id"}
                  mappingField={"userId"}
                  payloadKey={"users"}
                />
              </TabPanel>
              {/* Third Tab: User Group Members - Teams */}
              <TabPanel margin={0} p={0} mt={4}>
                <DraggableGridsComponent
                  populationData={teamPopulationData}
                  populationTitle={"Teams"}
                  sampleData={teamSampleData}
                  sampleTitle={"Teams in group"}
                  endpoint={`/api/userGroup/many/${userGroupId}`}
                  fieldDefs={teamFieldDefs}
                  dynamicIdField={"id"}
                  mappingField={"teamId"}
                  payloadKey={"teams"}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    );
  }
}
