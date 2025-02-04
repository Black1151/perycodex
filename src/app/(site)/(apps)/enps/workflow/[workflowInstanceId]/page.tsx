import React from "react";
import apiClient from "@/lib/apiClient";
import WorkflowLayout from "@/app/(site)/(apps)/WorkflowLayout";
import {verifySession} from "@/lib/dal";
import {redirect} from "next/navigation";

// Define the structure of each workflow stage
export interface WorkflowStage {
    wfInstId: number;
    wfInstCustomer: number;
    wfInstCreatedBy: number;
    wfInstStatus: number;
    wfInstTool: number;
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

export default async function ENPSWorkflowPage({
                                                             params,
                                                         }: {
    params: { workflowInstanceId: string };
}) {
    const session = await verifySession();

    // If there's no session, redirect to log in
    if (!session) {
        redirect("/login");
    }

    const workflowInstanceId = params.workflowInstanceId || null;

    // Fetching workflow stages data
    const response = await apiClient(
        `/getAllView?view=vwWorkflowStageInstancesStatus&wfInstId=${workflowInstanceId}`,
    );
    const responseData: ApiResponse = await response.json();
    const stages = responseData.resource;

    // Pass the fetched data to WorkflowLayout
    return (
        <WorkflowLayout
            stages={stages}
            layout={'enps'}
            workflowInstanceId={workflowInstanceId}/>
    );
}
