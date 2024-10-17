import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";
import {redirect} from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import {tagFields} from "@/components/agGrids/dataFields/tagFields";

export default async function TagsPage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, "/tags");

    let url = '/getAllView?view=vwTagsList';
    let headerTitle = 'Tags';

    const res = await apiClient(url);

    if (!res.ok) {
        return redirect("/error");
    }

    const tags = await res.json();
    const tagData = tags.resource;

    const tagCount = tagData ? tagData.length : 0;

    if (tagData && tagCount > 0) {
        return (
            <>
                <AdminHeader headingText={headerTitle} dataCount={tagCount}/>
                <DataGridComponent
                    data={tagData}
                    initialFields={tagFields}
                    createNewUrl={"/tags/create"}
                />
            </>
        );
    } else {
        return (
            <>
                <h1>No Tags Found</h1>
            </>
        );
    }
}
