import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {formsJson} from "@/components/surveyjs/forms/forms";

export default async function FormsCreatePage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, "/forms/create");

    return (
        <>
            <AdminHeader headingText="Create Form"/>
            <SurveyComponent
                surveyJson={formsJson}
                endpoint={'/form'}
                isNew={true}
                layout={'default'}
                redirectUrl={'/forms'}
                sjsPath={'admin'}
            />
        </>
    );
}
