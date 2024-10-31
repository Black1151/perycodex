import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {emailSecureLinkJson} from "@/components/surveyjs/forms/emailSecureLink";

export default async function EmailSecureLinkCreatePage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, "/email-secure-link/create");

    return (
        <>
            <AdminHeader headingText="Create Email Secure Link"/>
            <SurveyComponent
                surveyJson={emailSecureLinkJson}
                endpoint={'/test'}
                isNew={true}
                layout={'default'}
                redirectUrl={'/email-secure-link'}
                sjsPath={'admin'}
            />
        </>
    );
}
