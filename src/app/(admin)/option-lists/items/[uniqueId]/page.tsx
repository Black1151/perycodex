import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";
import {redirect} from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {optionListItemsJson} from "@/components/surveyjs/forms/optionListItems";
import {OptionListItemDetailsBanner} from "@/components/AdminDetailsBanners/OptionListItemDetailsBanner";

export default async function OptionListsDetailPage({params}: { params: { uniqueId: string }; }) {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/option-lists/items/${params.uniqueId}`);

    // const res = await apiClient(`/optionList/findBy?id=${params.uniqueId}`);

    // if (!res.ok) {
    //     return redirect("/error");
    // }
    //
    // const optionList = await res.json();
    // const optionListData = optionList.resource;

    const optionListItemData = {
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
    };

    return (
        <>
            <OptionListItemDetailsBanner optionListItem={optionListItemData}/>
            <SurveyComponent
                surveyJson={optionListItemsJson}
                endpoint={`/optionList/${params.uniqueId}`}
                isNew={false}
                dataset={optionListItemData}
                sjsPath={'admin'}
                reloadPageOnSuccess={true}
            />
        </>
    );
}
