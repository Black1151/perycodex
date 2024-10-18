import {redirect} from "next/navigation";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import {teamFields} from "@/components/agGrids/dataFields/teamFields";
import AdminHeader from "@/components/AdminHeader";
import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";

export default async function TeamsPage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, "/customers");

    const res = await apiClient(`/getAllView?view=vwUserTeamsList`);

    if (!res.ok) {
        return redirect("/error");
    }

    const teams = await res.json();
    const teamData = teams.resource;

    const teamCount = teamData ? teamData.length : 0;

    if (teamData) {
        return (
            <>
                <AdminHeader headingText={'Departments / Teams'} dataCount={teamCount}/>
                <DataGridComponent
                    data={teamData}
                    initialFields={teamFields}
                    createNewUrl={"/teams/create"}
                />
            </>
        );
    } else {
        return (
            <>
                <h1>No Teams Found</h1>
            </>
        );
    }
}
