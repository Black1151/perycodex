import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {emailTemplateJson} from "@/components/surveyjs/forms/emailTemplate";

export default async function EmailTemplateCreatePage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, "/email-template/create");

    return (
        <>
            <AdminHeader headingText="Create Email Template"/>
            <SurveyComponent
                surveyJson={emailTemplateJson}
                endpoint={'/emailTemplate'}
                isNew={true}
                layout={'default'}
                redirectUrl={'/email-template'}
                sjsPath={'admin'}
            />
        </>
    );
}
