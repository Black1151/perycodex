import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";
import {redirect} from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {EmailScheduleDetailsBanner} from "@/components/AdminDetailsBanners/EmailScheduleDetailsBanner";
import {emailScheduleJson} from "@/components/surveyjs/forms/emailSchedule";

export default async function EmailTemplatesDetailPage({
                                                           params,
                                                       }: {
    params: { uniqueId: string };
}) {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/email-schedule/${params.uniqueId}`);

    const res = await apiClient(`/emailSchedule/findBy?id=${params.uniqueId}`);

    if (!res.ok) {
        return redirect("/error");
    }

    const emailSchedule = await res.json();
    const emailScheduleData = emailSchedule.resource;

    return (
        <>
            <EmailScheduleDetailsBanner emailSchedule={emailScheduleData}/>
            <SurveyComponent
                surveyJson={emailScheduleJson}
                endpoint={`/emailSchedule/${params.uniqueId}`}
                isNew={false}
                dataset={emailScheduleData}
                layout={'default'}
                sjsPath={'admin'}
                reloadPageOnSuccess={true}
            />
        </>
    );
}
