import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";
import TabbedGrids from "@/components/agGrids/TabbedGrids";
import {redirect} from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import {optionListFields} from "@/components/agGrids/dataFields/optionListFields";
import {optionListGroupsFields} from "@/components/agGrids/dataFields/optionListGroupFields";
import {optionListItemsFields} from "@/components/agGrids/dataFields/optionListItemFields";

// Fake API function to simulate fetching data
const fakeApiCall = (data: any) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({resource: data});
        }, 1000); // Simulate a 1-second delay
    });
};

export default async function FormsPage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, "/option-lists");

    // Mocked data to simulate what you would get from the API
    const mockOptionLists = [
        {
            "id": 1,
            "name": "Colors",
            "description": "List of available colors",
            "isEditableByCustomer": true,
            "optionListGroupId": 1,
            "isActive": true,
            "createdAt": "2023-10-01T10:00:00Z",
            "updatedAt": "2023-10-10T10:00:00Z",
            "createdBy": 1,
            "updatedBy": 1
        },
        {
            "id": 2,
            "name": "Sizes",
            "description": "List of available sizes",
            "isEditableByCustomer": false,
            "optionListGroupId": 2,
            "isActive": true,
            "createdAt": "2023-10-02T10:00:00Z",
            "updatedAt": "2023-10-11T10:00:00Z",
            "createdBy": 2,
            "updatedBy": 2
        }
    ];
    const mockOptionListItems = [
        {
            "id": 1,
            "optionListId": 1,
            "value1": "Red",
            "value2": null,
            "value3": null,
            "value4": null,
            "value5": null,
            "valueJson": null,
            "imageUrl": null,
            "sortOrder": 1,
            "isActive": true,
            "createdAt": "2023-10-01T12:00:00Z",
            "updatedAt": "2023-10-10T12:00:00Z",
            "createdBy": 1,
            "updatedBy": 1
        },
        {
            "id": 2,
            "optionListId": 1,
            "value1": "Blue",
            "value2": null,
            "value3": null,
            "value4": null,
            "value5": null,
            "valueJson": null,
            "imageUrl": null,
            "sortOrder": 2,
            "isActive": true,
            "createdAt": "2023-10-01T13:00:00Z",
            "updatedAt": "2023-10-10T13:00:00Z",
            "createdBy": 1,
            "updatedBy": 1
        }
    ];
    const mockOptionListGroups = [
        {
            "id": 1,
            "name": "Attributes",
            "description": "Group for product attributes",
            "customerId": 1,
            "isActive": true,
            "createdAt": "2023-09-01T10:00:00Z",
            "updatedAt": "2023-09-10T10:00:00Z",
            "createdBy": 1,
            "updatedBy": 1
        },
        {
            "id": 2,
            "name": "Properties",
            "description": "Group for product properties",
            "customerId": 2,
            "isActive": true,
            "createdAt": "2023-09-02T10:00:00Z",
            "updatedAt": "2023-09-11T10:00:00Z",
            "createdBy": 2,
            "updatedBy": 2
        }
    ];

    try {
        // Simulate fetching all data in parallel using fake promises
        const [optionListsRes, optionListItemsRes, optionListGroupsRes] = await Promise.all([
            fakeApiCall(mockOptionLists),
            fakeApiCall(mockOptionListItems),
            fakeApiCall(mockOptionListGroups),
        ]);

        // Use the fake data
        const optionListData = optionListsRes.resource;
        const optionListItemData = optionListItemsRes.resource;
        const optionListGroupData = optionListGroupsRes.resource;

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
