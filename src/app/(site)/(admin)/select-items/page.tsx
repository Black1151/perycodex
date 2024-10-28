import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";
import {redirect} from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import {selectItemFields} from "@/components/agGrids/dataFields/selectItemFields";

export default async function FormsPage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, "/select-items");

    let url = '/selectItem/allBy';
    let headerTitle = 'Select Items';

    const res = await apiClient(url, { cache: "no-store" });

    if (!res.ok) {
        return redirect("/error");
    }

    const selectItems = await res.json();
    const selectItemData = selectItems.resource || [];

    const selectItemCount = selectItemData ? selectItemData.length : 0;

    if (selectItemData) {
        return (
            <>
                <AdminHeader headingText={headerTitle} dataCount={selectItemCount}/>
                <DataGridComponent
                    data={selectItemData}
                    initialFields={selectItemFields}
                    createNewUrl={"/select-items/create"}
                />
            </>
        );
    } else {
        return (
            <>
                <h1>No Select Items Found</h1>
            </>
        );
    }
}
