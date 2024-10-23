import AdminHeader from "@/components/AdminHeader";
import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";

// Define the structure of each workflow stage
interface WorkflowStage {
    wfInstId: number;
    bpName: string;
    stageStatus: string;
    formId: number;
    bpOrder: number;
    jsonFile?: string;  // Assuming jsonFile is part of the resource
    jsAdditionalFileUrl?: string;
    cssThemeFileUrl?: string;
    sjsThemeFileUrl?: string;
}

// Define the structure of the API response
interface ApiResponse {
    resource: WorkflowStage[];
}

interface SearchParams {
    workflowInstanceId?: string;
}

export default async function TestHappinessScorePage({searchParams}: { searchParams: SearchParams }) {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/test-happiness-score`);

    const wfId = searchParams.workflowInstanceId || undefined;

    // Fetching workflow stages data
    const response = await apiClient(`/getAllView?view=vwWorkflowStageInstancesStatus&wfInstId=${wfId}`);
    const responseData: ApiResponse = await response.json();

    // Step 1: Sort the stages by bpOrder
    const orderedStages = responseData.resource.sort((a, b) => a.bpOrder - b.bpOrder);

    // Step 2: Find the stage with stageStatus "Next"
    const nextStage = orderedStages.find(stage => stage.stageStatus === "Next");

    // Step 3: Extract required paths for SurveyComponent if the next stage exists
    const formId = nextStage?.formId || '';
    const jsPath = nextStage?.jsAdditionalFileUrl || '';
    const cssPath = nextStage?.cssThemeFileUrl || '';
    const sjsPath = nextStage?.sjsThemeFileUrl || '';

    // Getting the form level data
    const formData = await apiClient(`/form/findBy?id=${formId}`);
    const formDataResource = await formData.json();
    const formDataSource = formDataResource.resource;
    const {jsonFile} = formDataSource;

    return (
        <>
            <AdminHeader headingText={'Test Happiness Score (API)'}/>

            {nextStage ? (
                <SurveyComponent
                    surveyJson={jsonFile}
                    endpoint={'/test'}
                    isNew={true}
                    layout={'happiness'}
                    redirectUrl={'/test-happiness-score?workflowId=1&toolId=1'}
                    jsPath={jsPath}
                    cssPath={cssPath}
                    sjsPath={sjsPath}
                    layoutOptions={{showTitle: true}}
                />
            ) : (
                <p>No next stage found.</p>
            )}
        </>
    );
}
