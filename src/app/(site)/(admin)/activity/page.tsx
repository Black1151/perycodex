import apiClient from "@/lib/apiClient";
import { checkUserRole, getUser } from "@/lib/dal";
import { redirect } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import { activityFields } from "@/components/agGrids/dataFields/activityFields";
import TabbedGrids from "@/components/agGrids/TabbedGrids";

export const dynamic = "force-dynamic";

export interface ActivityResponse {
  wfInstId: number;
  wfInstUniqueId: string;
  toolConfigId: number;
  toolName: string;
  toolIconUrl: string;
  toolAppUrl: string;
  wfId: number;
  wfInstCustId: number;
  wfInstCustName: string;
  wfInstCustUniqueId: string;
  wfInstCustImageUrl: string;
  wfInstStartedBy: number;
  wfStarterUniqueId: string;
  wfStarterFullname: string;
  wfStarterImageUrl: string;
  wfStarterDeptId: number;
  wfStarterTeamId: number;
  wfStarterTeamName: string;
  wfInstStartDate: string;
  wfInstCompDate: string;
  wfInstStatus: number;
  wfInstStatusName: string;
  wfInstStatusBgColour: string;
  wfInstStatusFgColour: string;
  noStagesPossible: number;
  noStagesPending: number;
  noStagesStarted: number;
  noStagesCompleted: number;
}

export default async function ActivityPage() {
  const user = await getUser(); // Awaiting user data
  const userRole = user.role; // Fetch the user's role
  const isManagerofTeams =
    user.managementRoleIndicator === 2 || user.managementRoleIndicator === 3;
  await checkUserRole("/activity");

  let headerTitle = "Activity";

  // URLs for different activity types
  let myActivityUrl = `/getAllView?view=vwProgressList&wfInstStartedBy=${user.userId}`; // Everyone
  let myTeamsActivityUrl = `/getAllView?view=vwProgressList&wfStarterTeamManagerId=${user.userId}`; // User who is manager
  let ourActivityUrl = `/getAllView?view=vwProgressList&wfInstCustId=${user.customerId}`; // CS CL CA

  let resArray: string[] = [];

  // Set up conditional API calls based on the user's role
  const apiCalls = [
    apiClient(myActivityUrl, { cache: "no-store" }), // My Activity is for everyone
  ];
  resArray.push("myActivityRes");

  if (isManagerofTeams) {
    // Only fetch My Team Activity if the user is a manager
    apiCalls.push(apiClient(myTeamsActivityUrl, { cache: "no-store" }));
    resArray.push("myTeamsActivityRes");
  }

  if (["CS", "CL", "CA"].includes(userRole)) {
    // Only fetch Our Activity and Team Activity if the role matches
    apiCalls.push(apiClient(ourActivityUrl, { cache: "no-store" }));
    resArray.push("ourActivityRes");
  }

  // Execute the relevant API calls in parallel
  const apiResponses = await Promise.all(apiCalls);

  // Check if any of the responses are not ok
  if (apiResponses.some((res) => !res.ok)) {
    return redirect("/error");
  }

  // Extract the data from each response dynamically based on `resArray`
  const responseData = await Promise.all(apiResponses.map((res) => res.json()));

  // Create a dynamic mapping of responses
  const responses: { [key: string]: ActivityResponse[] } = {};
  resArray.forEach((key, index) => {
    responses[key] = responseData[index]?.resource || [];
  });

  // Map responses to their respective data arrays
  const myActivityData = responses["myActivityRes"] || [];
  const myTeamsActivityData = responses["myTeamsActivityRes"] || [];
  const ourActivityData = responses["ourActivityRes"] || [];

  // Create data sources for TabbedGrids
  const dataSources = [
    {
      data: myActivityData,
      title: "My Activity",
      fields: activityFields,
    },
  ];

  if (isManagerofTeams) {
    dataSources.push({
      data: myTeamsActivityData,
      title: "My Teams Activity",
      fields: activityFields,
    });
  }

  // Conditionally add data sources based on user role
  if (["CS", "CL", "CA"].includes(userRole)) {
    dataSources.push({
      data: ourActivityData,
      title: "Our Activity",
      fields: activityFields,
    });
  }

  // Set the header title dynamically based on the number of data sources
  if (dataSources.length === 1) {
    headerTitle = dataSources[0].title;
  }

  return (
    <>
      <AdminHeader headingText={headerTitle} />
      <TabbedGrids dataSources={dataSources} />
    </>
  );
}
