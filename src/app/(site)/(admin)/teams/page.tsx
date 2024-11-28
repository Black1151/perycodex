import { redirect } from "next/navigation";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import { teamFields } from "@/components/agGrids/dataFields/teamFields";
import AdminHeader from "@/components/AdminHeader";
import apiClient from "@/lib/apiClient";
import { checkUserRole, getUser } from "@/lib/dal";

export default async function TeamsPage() {
  const user = await getUser();
  await checkUserRole("/teams");

  let headerTitle = "Departments / Teams";

  if (user.role !== "CA") {
    headerTitle = "Our Departments / Teams";
  }

  const res = await apiClient(`/getAllView?view=vwUserTeamsList`);

  if (!res.ok) {
    return redirect("/error");
  }

  const teams = await res.json();
  const teamData = teams.resource || [];

  const teamCount = teamData.length;

  return (
    <>
      <AdminHeader headingText={headerTitle} dataCount={teamCount} />
      <DataGridComponent
        data={teamData}
        initialFields={teamFields}
        createNewUrl={"/teams/create"}
      />
    </>
  );
}
