import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";
import {redirect} from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import {optionListFields} from "@/components/agGrids/dataFields/optionListFields";

export default async function FormsPage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, "/option-lists");

    let url = '/optionList/allBy';
    let headerTitle = 'Option Lists';

    const res = await apiClient(url, { cache: "no-store" });

    // if (!res.ok) {
    //     return redirect("/error");
    // }

    // const optionLists = await res.json();

    const optionLists = {"resource": []}
    const optionListData = optionLists.resource;

    const optionListCount = optionListData ? optionListData.length : 0;

    if (optionListData && optionListCount > 0) {
        return (
            <>
                <AdminHeader headingText={headerTitle} dataCount={optionListCount}/>
                <DataGridComponent
                    data={optionListData}
                    initialFields={optionListFields}
                    createNewUrl={"/option-lists/create"}
                />
            </>
        );
    } else {
        return (
            <>
                <h1>No Option Lists Found</h1>
            </>
        );
    }
}
