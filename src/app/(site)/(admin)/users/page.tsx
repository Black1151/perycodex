import DataGridComponent from "@/components/agGrids/DataGridComponent";
import { userFields } from "@/components/agGrids/dataFields/userFields";
import AdminHeader from "@/components/AdminHeader";
import InviteNewUserModalForPA from "@/app/(site)/(admin)/users/InviteUser";
import apiClient from "@/lib/apiClient";
import {checkUserRole, getUser} from "@/lib/dal";

interface SearchParams {
  userType?: string;
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
    const user = await getUser();
    await checkUserRole("/users");

  let url = `/getAllView?view=vwUsersList&selectColumns=id,userUniqueId,email,role,fullName,jobTitle,imageUrl,customerId,custName,custUniqueId,custImageUrl,custParentId,siteName,siteUniqueId,isActive`;
  let headerTitle = "Users";
  let userTypeParam = searchParams.userType;
  let createNewUrl = "/users/create";


    if (user.role === "CA") {
        if (!["internal", "external"].includes(userTypeParam || "")) {
            userTypeParam = "internal";
        }

        if (userTypeParam === "internal") {
            headerTitle = "My Company Users";
            url += `&customerId=${user.customerId}`;
            createNewUrl = "";
        } else if (userTypeParam === "external") {
            headerTitle = "My Client Users";
            url += `&custParentId=${user.customerId}`;
            createNewUrl += `?userType=external`;
        }
    } else if (user.role === "PA") {
        headerTitle = "Users";
        url += `&role=!=EU`;
    }

  const res = await apiClient(url, { cache: "no-store" });

  const users = await res.json();
  const userData = users.resource;

  const userCount = userData ? userData.length : 0;

    if (userData) {
        return (
            <>
                <AdminHeader
                    headingText={headerTitle ?? "Users"}
                    dataCount={userCount}
                />
                <DataGridComponent
                    data={userData}
                    initialFields={userFields}
                    createNewUrl={createNewUrl ? createNewUrl : undefined}
                    createNewUrlButtonText={
                        user.role === "PA" ||
                        (user.role === "CA" && userTypeParam === "internal")
                            ? "Invite New"
                            : "Create New"
                    }
                    isModalEnabled={
                        user.role === "PA" ||
                        (user.role === "CA" && userTypeParam === "internal")
                    }
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
