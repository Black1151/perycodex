import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";
import {redirect} from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {TagDetailsBanner} from "@/components/AdminDetailsBanners/TagDetailsBanner";
import {tagsJson} from "@/components/surveyjs/forms/tags";

export default async function TagsDetailPage({
                                                 params,
                                             }: {
    params: { uniqueId: string };
}) {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/tags/${params.uniqueId}`);

    const res = await apiClient(`/tag/findBy?id=${params.uniqueId}`);

    if (!res.ok) {
        return redirect("/error");
    }

    const tag = await res.json();
    const tagData = tag.resource;

    return (
        <>
            <TagDetailsBanner tag={tagData}/>
            <SurveyComponent
                surveyJson={tagsJson}
                endpoint={`/tag/${params.uniqueId}`}
                isNew={false}
                dataset={tagData}
                layout={'default'}
                sjsPath={'admin'}
                reloadPageOnSuccess={true}
            />
        </>
    );
}
