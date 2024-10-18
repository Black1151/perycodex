import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";
import {redirect} from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {selectItemsJson} from "@/components/surveyjs/forms/selectItems";
import {SelectItemDetailsBanner} from "@/components/AdminDetailsBanners/SelectItemDetailsBanner";

export default async function SelectItemsDetailPage({params}: { params: { uniqueId: string }; }) {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/select-items/${params.uniqueId}`);

    const res = await apiClient(`/selectItem/findBy?id=${params.uniqueId}`);

    if (!res.ok) {
        return redirect("/error");
    }

    const selectItem = await res.json();
    const selectItemData = selectItem.resource;

    console.log(selectItemData);

    return (
        <>
            <SelectItemDetailsBanner selectItem={selectItemData}/>
            <SurveyComponent
                surveyJson={selectItemsJson}
                endpoint={`/selectItem/${params.uniqueId}`}
                isNew={false}
                dataset={selectItemData}
                sjsPath={'admin'}
            />
        </>
    );
}
