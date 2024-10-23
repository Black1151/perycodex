import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";
import TabbedGrids from "@/components/agGrids/TabbedGrids";
import {redirect} from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import {optionListFields} from "@/components/agGrids/dataFields/optionListFields";
import {optionListGroupsFields} from "@/components/agGrids/dataFields/optionListGroupFields";
import {optionListItemsFields} from "@/components/agGrids/dataFields/optionListItemFields";

export default async function OptionListsPage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, "/option-lists");

    const optionListUrl = '/optionList/allBy'
    const optionListItemsUrl = '/optionListItem/allBy'
    const optionListGroupsUrl = '/optionListGroup/allBy'

    try {
        // Simulate fetching all data in parallel using fake promises
        const [optionListsRes, optionListItemsRes, optionListGroupsRes] = await Promise.all([
            apiClient(optionListUrl, {cache: "no-store"}),
            apiClient(optionListItemsUrl, {cache: "no-store"}),
            apiClient(optionListGroupsUrl, {cache: "no-store"}),
        ]);

        const optionListsJson = await optionListsRes.json();
        const optionListItemsJson = await optionListItemsRes.json();
        const optionListGroupsJson = await optionListGroupsRes.json();

        // Use the fake data
        const optionListData = await optionListsJson.resource;
        const optionListItemData = await optionListItemsJson.resource;
        const optionListGroupData = await optionListGroupsJson.resource;


        const dataSources = [
            {
                data: optionListData,
                title: "Option Lists",
                fields: optionListFields,
                createNewUrl: "/option-lists/lists/create",
            },
            {
                data: optionListItemData,
                title: "Option List Items",
                fields: optionListItemsFields,
                createNewUrl: "/option-lists/items/create",
            },
            {
                data: optionListGroupData,
                title: "Option List Groups",
                fields: optionListGroupsFields,
                createNewUrl: "/option-lists/groups/create",
            }
        ]

        return (
            <>
                {/* Admin header with consistent theme */}
                <AdminHeader headingText="Option Lists Management"/>
                <TabbedGrids dataSources={dataSources}/>
            </>
        );
    } catch (error) {
        console.error("Error fetching data:", error);
        return redirect("/error");
    }
}
