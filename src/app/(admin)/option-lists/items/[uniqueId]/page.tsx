import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";
import {redirect} from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {optionListItemsJson} from "@/components/surveyjs/forms/optionListItems";
import {OptionListItemDetailsBanner} from "@/components/AdminDetailsBanners/OptionListItemDetailsBanner";
import OptionListItemsCreatePage from "@/app/(admin)/option-lists/items/create/page";

export default async function OptionListItemsDetailPage({params}: { params: { uniqueId: string }; }) {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/option-lists/items/${params.uniqueId}`);

    const res = await apiClient(`/optionListItem/findBy?id=${params.uniqueId}`);

    if (!res.ok) {
        return redirect("/error");
    }

    const optionListItem = await res.json();
    const optionListItemData = optionListItem.resource;

    return (
        <>
            <OptionListItemDetailsBanner optionListItem={optionListItemData}/>
            <SurveyComponent
                surveyJson={optionListItemsJson}
                endpoint={`/optionListItem/${params.uniqueId}`}
                isNew={false}
                dataset={optionListItemData}
                sjsPath={'admin'}
                reloadPageOnSuccess={true}
            />
        </>
    );
}
