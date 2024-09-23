import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {Heading} from "@chakra-ui/react";

// AG Grids
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import DataGridComponentClient from "@/components/agGrids/DataGridComponentClient";
import {groupFields} from "@/components/agGrids/dataFields/userGroupFields";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function UsersPage() {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    if (!authToken) {
        return redirect("/login");
    }

    // Fetch userGroups data from the backend
    const res = await fetch(`${process.env.BE_URL}/userGroup/allBy?selectColumns=id,name,customerId,description,isActive`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });

    if (!res.ok) {
        return redirect("/error");
    }

    const userGroups = await res.json();
    const userGroupData = userGroups.resource;
    console.log(userGroupData);

    // Check if userGroupData exists and has data
    if (userGroupData && userGroupData.length > 0) {
        return (
            <>
                <Heading>Server Fetched Data</Heading>
                <DataGridComponent data={userGroupData} initialFields={groupFields}
                                   createNewUrl={'/userGroups/create'}/>
                
                <Heading mt={4}>Client Fetched Data with Server Route</Heading>
                <DataGridComponentClient endpoint={'api/userGroup/allBy?selectColumns=id,name,customerId,description,isActive'} initialFields={groupFields}
                                         createNewUrl={'/userGroups/create'}/>
            </>
        );
    } else {
        return (
            <>
                <h1>No Users Found</h1>
            </>
        );
    }
}
