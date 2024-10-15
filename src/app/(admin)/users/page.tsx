import {cookies} from "next/headers";
import {redirect} from "next/navigation";

// AG Grids
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import {userFields} from "@/components/agGrids/dataFields/userFields";
import AdminHeader from "@/components/AdminHeader";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function UsersPage() {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token")?.value;
    const uniqueId = cookieStore.get("user_uuid")?.value;

    if (!authToken) {
        return redirect("/login");
    }

    // Fetch users data from the backend
    const res = await fetch(`${process.env.BE_URL}/getAllView?view=vwUsersList&selectColumns=id,userUniqueId,email,role,fullName,jobTitle,imageUrl,custName,siteName,isActive`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });

    const users = await res.json();
    const userData = users.resource;

    const userCount = userData ? userData.length : 0;

    // Check if userData exists and has data
    if (userData && userCount > 0) {
        return (
            <>
                <AdminHeader headingText={'USERS'} dataCount={userCount}/>
                <DataGridComponent data={userData}
                                   initialFields={userFields}
                                   createNewUrl={'/users/create'}
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
