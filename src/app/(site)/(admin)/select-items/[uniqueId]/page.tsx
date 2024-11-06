import apiClient from "@/lib/apiClient";
import {redirect} from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {selectItemsJson} from "@/components/surveyjs/forms/selectItems";
import {SelectItemDetailsBanner} from "@/components/AdminDetailsBanners/SelectItemDetailsBanner";
import {checkUserRole} from "@/lib/dal";

export default async function SelectItemsDetailPage({params}: { params: { uniqueId: string }; }) {
    await checkUserRole(`/select-items/${params.uniqueId}`);

    const res = await apiClient(`/selectItem/findBy?id=${params.uniqueId}`);

    if (!res.ok) {
        return redirect("/error");
    }

    const selectItem = await res.json();
    const selectItemData = selectItem.resource;

    return (
        <>
            <SelectItemDetailsBanner selectItem={selectItemData}/>
            <SurveyComponent
                surveyJson={selectItemsJson}
                endpoint={`/selectItem/${params.uniqueId}`}
                isNew={false}
                dataset={selectItemData}
                sjsPath={'admin'}
                reloadPageOnSuccess={true}
            />
        </>
    );
}
