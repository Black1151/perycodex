import apiClient from "@/lib/apiClient";
import {redirect} from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {EmailScheduleDetailsBanner} from "@/components/AdminDetailsBanners/EmailScheduleDetailsBanner";
import {emailScheduleJson} from "@/components/surveyjs/forms/emailSchedule";
import {checkUserRole, getUser} from "@/lib/dal";
import {caEmailScheduleJson} from "@/components/surveyjs/forms/caEmailSchedule";

export default async function EmailTemplatesDetailPage({
                                                           params,
                                                       }: {
    params: { uniqueId: string };
}) {
    const user = await getUser();
    await checkUserRole(`/email-schedule/${params.uniqueId}`);

    // Determine the correct URL based on the user's role
    const apiUrl =
        user.role === "CA"
            ? `/getView?view=vwEmailSchedulesCustomerList&customerId=${user.customerId}&id=${params.uniqueId}`
            : `/emailSchedule/findBy?id=${params.uniqueId}`;

    const res = await apiClient(apiUrl);

    if (!res.ok) {
        return redirect("/error");
    }

    const emailSchedule = await res.json();
    const emailScheduleData = emailSchedule.resource;

    return (
        <>
            <EmailScheduleDetailsBanner emailSchedule={emailScheduleData}/>
            <SurveyComponent
                surveyJson={user.role === 'PA' ? emailScheduleJson : caEmailScheduleJson}
                endpoint={user.role === 'PA' ? `/emailSchedule/${params.uniqueId}` : `/emailScheduleCustomerOpt/${params.uniqueId}`}
                isNew={false}
                dataset={emailScheduleData}
                layout={'default'}
                sjsPath={'admin'}
                reloadPageOnSuccess={true}
            />
        </>
    );
}
