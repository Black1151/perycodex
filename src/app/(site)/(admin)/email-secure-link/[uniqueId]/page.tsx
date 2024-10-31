import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";
import {redirect} from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {EmailScheduleDetailsBanner} from "@/components/AdminDetailsBanners/EmailScheduleDetailsBanner";
import {emailSecureLinkJson} from "@/components/surveyjs/forms/emailSecureLink";

export default async function EmailTemplatesDetailPage({
                                                           params,
                                                       }: {
    params: { uniqueId: string };
}) {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/email-secure-link/${params.uniqueId}`);

    const res = await apiClient(`/emailSecureLink/findBy?id=${params.uniqueId}`);

    if (!res.ok) {
        return redirect("/error");
    }

    const emailSecureLink = await res.json();
    const emailSecureLinkData = emailSecureLink.resource;

    return (
        <>
            <EmailScheduleDetailsBanner emailSchedule={emailSecureLinkData}/>
            <SurveyComponent
                surveyJson={emailSecureLinkJson}
                endpoint={`/test`}
                isNew={false}
                dataset={emailSecureLinkData}
                layout={'default'}
                sjsPath={'admin'}
                reloadPageOnSuccess={true}
            />
        </>
    );
}
