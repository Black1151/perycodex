import {cookies} from "next/headers";
import {redirect} from "next/navigation";

// AG Grids
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import {userFields} from "@/components/agGrids/dataFields/userFields";
import InviteNewUserModal from "@/components/AdminDetailsBanners/InviteNewUserModal";

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
    const res = await fetch(`${process.env.BE_URL}/user/allBy?selectColumns=id,email,role,is_active,uniqueId`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });

    if (!res.ok) {
        return redirect("/error");
    }

    const userRes = await fetch(
            `${process.env.BE_URL}/getView?view=vwLoggedInUserIdentity&userUniqueId=${uniqueId}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );

    const signedInUser = await userRes.json();
    const signedInUserData = signedInUser.resource;

    const users = await res.json();
    const userData = users.resource;


    // Check if userData exists and has data
    if (userData && userData.length > 0) {
        return (
            <>
                <DataGridComponent data={userData}
                                   initialFields={userFields}
                                   createNewUrl={'/users/create'}
                                   isModalEnabled={signedInUserData.role == 'PA'}
                                   openModalComponent={<InviteNewUserModal />}
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
