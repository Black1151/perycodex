import {cookies} from "next/headers";
import {redirect} from "next/navigation";

// AG Grids
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import {groupFields} from "@/components/agGrids/dataFields/userGroupFields";
import AdminHeader from "@/components/AdminHeader";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function UsersPage() {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    if (!authToken) {
        return redirect("/login");
    }

    // Fetch user-groups data from the backend
    const res = await fetch(`${process.env.BE_URL}/getAllView?view=vwUserGroupsList`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });

    if (!res.ok) {
        return redirect("/error");
    }

    const userGroups = await res.json();
    const userGroupData = userGroups.resource;

    // Check if teamData exists and has data
    const userGroupCount = userGroupData ? userGroupData.length : 0;

    // Check if userGroupData exists and has data
    if (userGroupData && userGroupCount > 0) {
        return (
            <>
                <AdminHeader headingText={'User Groups'} dataCount={userGroupCount} />
                <DataGridComponent
                    data={userGroupData}
                    initialFields={groupFields}
                    createNewUrl={'/user-groups/create'}
                />
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
