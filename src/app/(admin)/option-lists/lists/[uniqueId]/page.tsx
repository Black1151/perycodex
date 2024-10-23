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

    const res = await apiClient(`/optionList/findBy?id=${params.uniqueId}`);

    if (!res.ok) {
        return redirect("/error");
    }

    const optionList = await res.json();
    const optionListData = optionList.resource;

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
