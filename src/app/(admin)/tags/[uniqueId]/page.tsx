import React from "react";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {siteJson} from "@/components/Z_surveyJs/forms/site";
import {SiteDetailsBanner} from "@/components/AdminDetailsBanners/SiteDetailsBanner";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";

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


    return (
        <div>
            <h1>Tags Update to be implemented</h1>
        </div>
    );
}
