import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";
import {redirect} from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {OptionListDetailsBanner} from "@/components/AdminDetailsBanners/OptionListDetailsBanner";
import {optionListJson} from "@/components/surveyjs/forms/optionLists";

export default async function OptionListsDetailPage({params}: { params: { uniqueId: string }; }) {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/option-lists/lists/${params.uniqueId}`);

    // const res = await apiClient(`/optionList/findBy?id=${params.uniqueId}`);
    //
    // if (!res.ok) {
    //     return redirect("/error");
    // }
    //
    // const optionList = await res.json();
    // const optionListData = optionList.resource;

    const optionListData = {
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
    };

    return (
        <>
            <OptionListDetailsBanner optionList={optionListData}/>
            <SurveyComponent
                surveyJson={optionListJson}
                endpoint={`/optionList/${params.uniqueId}`}
                isNew={false}
                dataset={optionListData}
                sjsPath={'admin'}
                reloadPageOnSuccess={true}
            />
        </>
    );
}
