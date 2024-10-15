import {cookies} from "next/headers";
import {redirect} from "next/navigation";

// AG Grids
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import {userFields} from "@/components/agGrids/dataFields/userFields";
import AdminHeader from "@/components/AdminHeader";
import InviteNewUserModalForPA from "@/app/(admin)/users/InviteUser";

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

    // Fetch user data
    let userIdentity = null;

    try {
        const identityResponse = await fetch(
            `${process.env.BE_URL}/getView?view=vwLoggedInUserIdentity&userUniqueId=${uniqueId}&selectColumns=customerId,role,userImageUrl,firstName`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );

        if (!identityResponse.ok) {
            throw new Error('Failed to fetch user identity');
        }

        userIdentity = (await identityResponse.json()).resource;
    } catch (error) {
        console.error("Error fetching user identity:", error);
        return redirect("/error");
    }


    // Fetch users data from the backend
    const res = await fetch(`${process.env.BE_URL}/getAllView?view=vwUsersList&selectColumns=id,userUniqueId,email,role,fullName,jobTitle,imageUrl,custName,custUniqueId,custImageUrl,siteName,isActive`, {
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
                                   createNewUrlButtonText={userIdentity.role === "PA" ? 'Invite New' : 'Create New'}
                                   isModalEnabled={userIdentity.role === "PA"}
                                   openModalComponent={InviteNewUserModalForPA}
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
