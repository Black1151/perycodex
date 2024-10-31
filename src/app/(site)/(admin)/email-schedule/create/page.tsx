import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {emailScheduleJson} from "@/components/surveyjs/forms/emailSchedule";

export default async function EmailTemplateCreatePage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, "/email-schedule/create");

    return (
        <>
            <AdminHeader headingText="Create Email Schedule"/>
            <SurveyComponent
                surveyJson={emailScheduleJson}
                endpoint={'/test'}
                isNew={true}
                layout={'default'}
                redirectUrl={'/email-schedule'}
                sjsPath={'admin'}
            />
        </>
    );
}
