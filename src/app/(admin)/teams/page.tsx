import {cookies} from "next/headers";
import {redirect} from "next/navigation";

// AG Grids
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import {teamFields} from "@/components/agGrids/dataFields/teamFields";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function SitesPage() {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    if (!authToken) {
        return redirect("/login");
    }

    // Fetch teams data from the backend
    const res = await fetch(`${process.env.BE_URL}/userTeam/allBy?selectColumns=id,name,description,customerId,parentTeamId,uniqueId,isActive`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });

    if (!res.ok) {
        return redirect("/error");
    }

    const teams = await res.json();
    const teamData = teams.resource;

    // Check if teamData exists and has data
    if (teamData && teamData.length > 0) {
        return (
            <>
                <DataGridComponent data={teamData}
                                   initialFields={teamFields}
                                   createNewUrl={'/teams/create'}/>

                {/*<Heading mt={4}>Client Fetched Data with Server Route</Heading>*/}
                {/*<DataGridComponentClient*/}
                {/*    endpoint={'api/userTeam/allBy?selectColumns=id,name,description,customerId,parentTeamId,uniqueId,isActive'}*/}
                {/*    initialFields={teamFields}*/}
                {/*    createNewUrl={'/teams/create'}/>*/}
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
