import React from "react";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {siteJson} from "@/components/surveyJs/forms/site";
import {SiteDetailsBanner} from "@/components/AdminDetailsBanners/SiteDetailsBanner";
import SurveyComponent from "@/components/surveyjs-new/SurveyComponent";

export default async function SitePage({
                                           params,
                                       }: {
    params: { uniqueId: string };
}) {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    if (!authToken) {
        return redirect("/login");
    }

    // Fetch site data from the backend
    const res = await fetch(
        `${process.env.BE_URL}/site/findBy?uniqueId=${params.uniqueId}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        }
    );

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
            />
        </div>
    );
}
