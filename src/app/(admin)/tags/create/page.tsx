import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {tagsJson} from "@/components/surveyjs/forms/tags";

export default async function TagsCreatePage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, "/tags/create");

    return (
        <>
            <AdminHeader headingText="Create Tag"/>
            <SurveyComponent
                surveyJson={tagsJson}
                endpoint={'/tag'}
                isNew={true}
                layout={'default'}
                redirectUrl={'/tags'}
                sjsPath={'admin'}
            />
        </>
    );
}
