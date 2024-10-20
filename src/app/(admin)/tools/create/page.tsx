import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {toolsJson} from "@/components/surveyjs/forms/tools";

export default async function FormsCreatePage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, "/tools/create");

    return (
        <>
            <AdminHeader headingText="Create Form"/>
            <SurveyComponent
                surveyJson={toolsJson}
                endpoint={'/form'}
                isNew={true}
                layout={'default'}
                redirectUrl={'/tools'}
                sjsPath={'admin'}
            />
        </>
    );
}
