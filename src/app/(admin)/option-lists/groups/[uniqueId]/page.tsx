import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";
import {redirect} from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {OptionListGroupDetailsBanner} from "@/components/AdminDetailsBanners/OptionListGroupDetailsBanner";
import {optionListGroupsJson} from "@/components/surveyjs/forms/optionListGroups";
import OptionListGroupsCreatePage from "@/app/(admin)/option-lists/groups/create/page";

export default async function OptionListGroupsDetailPage({params}: { params: { uniqueId: string }; }) {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/option-lists/groups/${params.uniqueId}`);

    const res = await apiClient(`/optionListGroup/findBy?id=${params.uniqueId}`);

    if (!res.ok) {
        return redirect("/error");
    }

    const optionListGroup = await res.json();
    const optionListGroupData = optionListGroup.resource;

    return (
        <>
            <OptionListGroupDetailsBanner optionListGroup={optionListGroupData}/>
            <SurveyComponent
                surveyJson={optionListGroupsJson}
                endpoint={`/optionListGroup/${params.uniqueId}`}
                isNew={false}
                dataset={optionListGroupData}
                sjsPath={'admin'}
                reloadPageOnSuccess={true}
            />
        </>
    );
}
