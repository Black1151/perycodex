import {redirect} from "next/navigation";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import {groupFields} from "@/components/agGrids/dataFields/userGroupFields";
import AdminHeader from "@/components/AdminHeader";
import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";

export default async function UserGroupsPage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, "/user-groups");

    const res = await apiClient(`/getAllView?view=vwUserGroupsList`);

    if (!res.ok) {
        return redirect("/error");
    }

    const userGroups = await res.json();
    const userGroupData = userGroups.resource;

    const userGroupCount = userGroupData ? userGroupData.length : 0;

    if (userGroupData) {
        return (
            <>
                <AdminHeader headingText={'User Groups'} dataCount={userGroupCount}/>
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
