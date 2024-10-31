import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";
import {redirect} from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {EmailTemplateDetailsBanner} from "@/components/AdminDetailsBanners/EmailTemplateDetailsBanner";
import {emailTemplateJson} from "@/components/surveyjs/forms/emailTemplate";

export default async function EmailTemplatesDetailPage({
                                                           params,
                                                       }: {
    params: { uniqueId: string };
}) {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/email-template/${params.uniqueId}`);

    const res = await apiClient(`/emailTemplate/findBy?id=${params.uniqueId}`);

    if (!res.ok) {
        return redirect("/error");
    }

    const emailTemplate = await res.json();
    const emailTemplateData = emailTemplate.resource;

    return (
        <>
            <EmailTemplateDetailsBanner emailTemplate={emailTemplateData}/>
            <SurveyComponent
                surveyJson={emailTemplateJson}
                endpoint={`/test`}
                isNew={false}
                dataset={emailTemplateData}
                layout={'default'}
                sjsPath={'admin'}
                reloadPageOnSuccess={true}
            />
        </>
    );
}
