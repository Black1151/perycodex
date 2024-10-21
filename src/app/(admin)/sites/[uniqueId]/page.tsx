import {redirect} from "next/navigation";
import {siteJson} from "@/components/surveyjs/forms/site";
import {SiteDetailsBanner} from "@/components/AdminDetailsBanners/SiteDetailsBanner";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";

export default async function SitesDetailPage({
                                           params,
                                       }: {
    params: { uniqueId: string };
}) {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/sites/${params.uniqueId}`);

    const res = await apiClient(`/site/findBy?uniqueId=${params.uniqueId}`);

    if (!res.ok) {
        return redirect("/error");
    }

    const site = await res.json();
    const siteData = site.resource;

    return (
        <div>
            <SiteDetailsBanner site={siteData}/>
            <SurveyComponent
                surveyJson={siteJson}
                endpoint={`/site/${params.uniqueId}`}
                isNew={false}
                dataset={siteData}
                sjsPath={'admin'}
                reloadPageOnSuccess={true}
            />
        </div>
    );
}
