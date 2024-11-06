import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {tagsJson} from "@/components/surveyjs/forms/tags";
import {checkUserRole} from "@/lib/dal";

export default async function TagsCreatePage() {
    await checkUserRole("/tags/create");

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
