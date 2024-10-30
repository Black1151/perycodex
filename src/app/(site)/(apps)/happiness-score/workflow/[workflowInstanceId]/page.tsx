import apiClient from "@/lib/apiClient";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {Box} from "@chakra-ui/react";

// Define the structure of each workflow stage
interface WorkflowStage {
    wfInstId: number;
    wfInstCustomer: number;
    wfInstCreatedBy: number;
    wfInstStatus: number;
    wfId: number;
    wfName: string;
    bpId: number;
    bpName: string;
    bpOrder: number;
    formId: number;
    jsAdditionalFileUrl: string;
    cssThemeFileUrl: string;
    sjsThemeFileUrl: string;
    largeIconImageUrl: string | null;
    smallIconImageUrl: string | null;
    userAccessGroupNames: string | null;
    startByDefault: boolean;
    minRequired: number;
    maxRequired: number;
    bpInstId: number;
    bpInstBpId: number;
    bpInstCustomer: number;
    bpInstCreatedBy: number;
    bpInstStartdDate: string | null;
    bpInstStatus: number;
    stageStatus: string;
    userGroupRestriction: boolean;
    wouldHaveBeenNextIfNotLocked: boolean;
}


// Define the structure of the API response
interface ApiResponse {
    resource: WorkflowStage[];
}

export default async function HappinessScoreWorkflowPage({params}: { params: { workflowInstanceId: string } }) {
    const workflowInstanceId = params.workflowInstanceId || undefined;

    // Fetching workflow stages data
    const response = await apiClient(`/getAllView?view=vwWorkflowStageInstancesStatus&wfInstId=${workflowInstanceId}`);
    const responseData: ApiResponse = await response.json();
    const stages = responseData.resource;

    let nextStage: WorkflowStage | undefined;

    // Determine whether we need to sort or directly use the single item
    if (stages.length === 1) {
        // Only one item, use it directly
        nextStage = stages[0];
    } else if (stages.length > 1) {
        // More than one item, sort by bpOrder and find the stage with "Next" status
        const orderedStages = stages.sort((a, b) => a.bpOrder - b.bpOrder);
        nextStage = orderedStages.find(stage => stage.stageStatus === "Next");
    }

    // Step 3: Extract required paths for SurveyComponent if the next stage exists
    const formId = nextStage?.formId || '';
    const jsPath = nextStage?.jsAdditionalFileUrl || '';
    const cssPath = nextStage?.cssThemeFileUrl || '';
    const sjsPath = nextStage?.sjsThemeFileUrl || '';
    const bpInstanceId = nextStage?.bpInstId || '';

    // Fetching form level data
    let jsonFile;

    try {
        const formData = await apiClient(`/form/findBy?id=${formId}`);
        const formDataResource = await formData.json();

        if (formDataResource && formDataResource.resource) {
            const formDataSource = formDataResource.resource;
            jsonFile = formDataSource.jsonFile || {};  // Set jsonFile to an empty object if not found
        } else {
            return (
                <Box mt="60px" width="full" height="calc(100vh - 60px)">
                    No Survey JS Form Associated with this
                </Box>
            )
        }
    } catch (error) {
        console.error("Error fetching form data:", error);
        jsonFile = {};  // Set jsonFile to an empty object or any default value if there's an error
    }

    return (
        <Box mt="60px" width="full" height="calc(100vh - 60px)">
            {nextStage ? (
                <SurveyComponent
                    surveyJson={jsonFile}
                    endpoint={`/api/workflows/saveWorkflow/${bpInstanceId}`}
                    isNew={true}
                    formSubmission="workflow"
                    layout="happiness"
                    redirectUrl={`/happiness-score?workflowId=1&toolId=1`}
                    jsPath={jsPath}
                    cssPath={cssPath}
                    sjsPath={sjsPath}
                    layoutOptions={{showTitle: true}}
                />
            ) : (
                <p>No next stage found.</p>
            )}
        </Box>
    );
}
