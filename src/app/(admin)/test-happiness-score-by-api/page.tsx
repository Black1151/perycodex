import AdminHeader from "@/components/AdminHeader";
import {happinessJson} from "@/components/surveyjs/forms/happiness";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";

export default async function TestHappinessScorePage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/test-happiness-score-by-api`);


    // Getting the workflow level data
    const workflowData = await apiClient('/workflow/findBy?id=1');
    const workflowDataResource = await workflowData.json();
    const workflowDataSource = workflowDataResource.resource;
    const {cssThemeFileUrl, jsAdditionalFileUrl , sjsThemeFileUrl} = workflowDataSource

    // Getting the form level data
    const formData = await apiClient('/form/findBy?id=1');
    const formDataResource = await formData.json();
    const formDataSource = formDataResource.resource;
    const {jsonFile} = formDataSource;


    return (
        <>
            <AdminHeader headingText={'Test Happiness Score (API)'}/>
            <SurveyComponent
                surveyJson={jsonFile}
                endpoint={'/test'}
                isNew={true}
                layout={'happiness'}
                redirectUrl={'/test-happiness-score-by-api'}
                jsPath={jsAdditionalFileUrl}
                cssPath={cssThemeFileUrl}
                sjsPath={sjsThemeFileUrl}
            />
        </>
    );
}


