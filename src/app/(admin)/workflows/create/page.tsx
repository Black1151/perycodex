import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {workflowJson} from "@/components/surveyjs/forms/workflows";

export default async function WorkflowsCreatePage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, "/workflows/create");

    return (
        <>
            <AdminHeader headingText="Create Workflow"/>
            <SurveyComponent
                surveyJson={workflowJson}
                endpoint={'/workflow'}
                isNew={true}
                layout={'default'}
                redirectUrl={'/workflows'}
                sjsPath={'admin'}
            />
        </>
    );
}
