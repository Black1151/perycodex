import {cookies} from "next/headers";
import {redirect} from "next/navigation";

// AG Grids
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import {userFields} from "@/components/agGrids/dataFields/userFields";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function UsersPage() {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token")?.value;

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

    const users = await res.json();
    const userData = users.resource;

    // Check if userData exists and has data
    if (userData && userData.length > 0) {
        return (
            <>
                <DataGridComponent data={userData} initialFields={userFields}
                                   createNewUrl={'/users/create'}/>
                
                {/*<Heading mt={4}>Client Fetched Data with Server Route</Heading>*/}
                {/*<DataGridComponentClient endpoint={'api/user/allBy'} initialFields={userFields}*/}
                {/*                         createNewUrl={'/users/create'}/>*/}
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
