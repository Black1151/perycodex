import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";
import {redirect} from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {OptionListGroupDetailsBanner} from "@/components/AdminDetailsBanners/OptionListGroupDetailsBanner";
import {optionListGroupsJson} from "@/components/surveyjs/forms/optionListGroups";

export default async function OptionListsDetailPage({params}: { params: { uniqueId: string }; }) {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/option-lists/groups/${params.uniqueId}`);

    // const res = await apiClient(`/optionList/findBy?id=${params.uniqueId}`);
    //
    // if (!res.ok) {
    //     return redirect("/error");
    // }
    //
    // const optionListGroup = await res.json();
    // const optionListGroupData = optionListGroup.resource;

    const optionListGroupData = {
        "id": 1,
        "name": "Attributes",
        "description": "Group for product attributes",
        "customerId": 1,
        "isActive": true,
        "createdAt": "2023-09-01T10:00:00Z",
        "updatedAt": "2023-09-10T10:00:00Z",
        "createdBy": 1,
        "updatedBy": 1
    };

    return (
        <>
            <OptionListGroupDetailsBanner optionListGroup={optionListGroupData}/>
            <SurveyComponent
                surveyJson={optionListGroupsJson}
                endpoint={`/optionList/${params.uniqueId}`}
                isNew={false}
                dataset={optionListGroupData}
                sjsPath={'admin'}
                reloadPageOnSuccess={true}
            />
        </>
    );
}
