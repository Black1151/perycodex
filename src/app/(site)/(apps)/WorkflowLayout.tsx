"use client";

import React, {useEffect, useState} from "react";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {WorkflowStage} from "@/app/(site)/(apps)/happiness-score/workflow/[workflowInstanceId]/page";
import {useFetchClient} from "@/hooks/useFetchClient";
import {
    LeftHandNavigationDrawer,
    MenuItem,
} from "@/components/layout/LeftHandNavigationDrawer";
import {Circle as CircleIcon} from "@mui/icons-material";
import {useWorkflow} from "@/providers/WorkflowProvider";
import {useUser} from "@/providers/UserProvider";
import SurveyModal from "@/components/surveyjs/layout/default/SurveyModal";
import {useRouter} from "next/navigation";

interface WorkflowLayoutProps {
    stages: WorkflowStage[];
    layout: 'default' | 'happiness' | 'enps' | 'client-satisfaction';
    workflowInstanceId: string | null;
}

interface Form {
    id: number;
    name: string;
    description: string;
    jsonFile: string | Record<string, any>;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    updatedBy: number;
}

interface FormDataResponse {
    id: number;
    businessProcessId: number;
    workflowInstanceId: number;
    customerId: number;
    currentStartByDefaultState: boolean;
    startDate?: string;
    completeDate?: string;
    stepName?: string;
    jsonResponse?: Record<string, any>;
    statusId?: number;
    saveAllowed?: boolean;
    uniqueId: string;
    startedBy?: number;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    updatedBy: number;
    statusName: string;
}

const REDIRECT_PATHS: Record<string, string> = {
    happiness: "/happiness-score",
    enps: "/enps",
    'client-satisfaction': "client-satisfaction",
    default: "/"
}

export default function WorkflowLayout({
                                           stages,
                                           layout,
                                           workflowInstanceId,
                                       }: WorkflowLayoutProps) {
    const {
        toolId,
        setToolId,
        workflowId,
        setWorkflowId,
        setCurrentWorkflowInstanceId,
        setCurrentBusinessProcessInstanceId,
    } = useWorkflow();
    const [currentStage, setCurrentStage] = useState<WorkflowStage | null>(null);
    const [currentForm, setCurrentForm] = useState<Form | null>(null);
    const [formData, setFormData] = useState<any | null>(null);
    const [isNew, setIsNew] = useState<boolean>(false);
    const {user} = useUser();
    const router = useRouter();
    const {fetchClient} = useFetchClient();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleNavigateAway = () => {
        router.push("/");
    };

    // Prepare menu items based on stages
    const menuItems: MenuItem[] = stages.map((stage) => ({
        label: stage.bpName,
        icon: <CircleIcon/>,
        onClick: () => setCurrentStage(stage),
        category: "Stages",
    }));

    useEffect(() => {
        setCurrentWorkflowInstanceId(workflowInstanceId);

        // Cleanup function to reset IDs on unmount
        return () => {
            setCurrentWorkflowInstanceId(null);
            setCurrentBusinessProcessInstanceId(null);
        };
    }, []);

    useEffect(() => {
        // Set the initial current stage
        if (stages.length === 1) {
            setCurrentStage(stages[0]);
        } else if (stages.length > 1) {
            const orderedStages = stages.sort((a, b) => a.bpOrder - b.bpOrder);
            setCurrentStage(
                orderedStages.find((stage) => stage.stageStatus === "Next") || null,
            );
        }
    }, [stages]);

    useEffect(() => {
        const fetchStageData = async () => {
            if (!currentStage) return;

            setCurrentBusinessProcessInstanceId(String(currentStage.bpInstId));
            setToolId(String(currentStage.wfInstTool));
            setWorkflowId(String(currentStage.wfId));

            try {
                // Prepare API requests
                const formDataRequest = currentStage.formId
                    ? fetchClient<Form>(`/api/workflows/getForm`, {
                        method: "POST",
                        body: {formId: currentStage.formId},
                        redirectOnError: false,
                    })
                    : Promise.resolve(null);

                const formDatasetRequest = currentStage.bpInstId
                    ? fetchClient<FormDataResponse>(`/api/workflows/getFormData`, {
                        method: "POST",
                        body: {businessProcessInstanceId: currentStage.bpInstId},
                        redirectOnError: false,
                    })
                    : Promise.resolve(null);

                // Execute requests concurrently
                const [formDataResource, formDataset] = await Promise.all([
                    formDataRequest,
                    formDatasetRequest,
                ]);

                // Update form state
                setCurrentForm(formDataResource || null);

                // Parse and update form data
                if (formDataset) {
                    const parsedResponse =
                        typeof formDataset.jsonResponse === "string"
                            ? JSON.parse(formDataset.jsonResponse)
                            : formDataset.jsonResponse;
                    setFormData(parsedResponse);

                    const isAuthorized =
                        // Yours form
                        formDataset.createdBy === user?.userId ||
                        formDataset.startedBy === user?.userId ||
                        // Anonymous users
                        formDataset.createdBy === 0 ||
                        formDataset.startedBy === 0;

                    if (!isAuthorized) {
                        setIsModalOpen(true);
                        return;
                    }

                    if (
                        (formDataset.statusId === 1 || formDataset.statusId === 2) &&
                        isAuthorized
                    ) {
                        setIsNew(true);
                    } else if (formDataset.statusId === 3) {
                        setIsNew(false);
                    }
                }
            } finally {
                // Additional cleanup logic if needed
            }
        };

        fetchStageData();
    }, [currentStage]);

    const redirectPath = REDIRECT_PATHS[layout] || REDIRECT_PATHS.default;
    const redirectUrl = `${redirectPath}?wfId=${workflowId}&toolId=${toolId}`;

    return (
        <>
            {/* Modal to block access */}
            <SurveyModal
                isOpen={isModalOpen}
                onConfirm={handleNavigateAway}
                onClose={handleNavigateAway}
                showButtons={{
                    close: false,
                    confirm: true,
                }}
                title="Unauthorised Access"
                bodyContent="You are not authorized to view this workflow."
                confirmLabel="OK"
                cancelLabel="Cancel"
            />

            {/* Render main content only if modal is not open */}
            {!isModalOpen && (
                <>
                    {stages.length > 1 && (
                        <LeftHandNavigationDrawer
                            menuItems={menuItems}
                            defaultDrawerState="half-open"
                        />
                    )}

                    {currentStage && currentForm && (
                        <SurveyComponent
                            surveyJson={
                                typeof currentForm.jsonFile === "string"
                                    ? JSON.parse(currentForm.jsonFile)
                                    : currentForm.jsonFile
                            }
                            endpoint={`/api/workflows/saveWorkflow/${currentStage.bpInstId}`}
                            isNew={isNew}
                            dataset={formData}
                            formSubmission="workflow"
                            layout={layout}
                            redirectUrl={redirectUrl}
                            jsPath={currentStage.jsAdditionalFileUrl}
                            cssPath={currentStage.cssThemeFileUrl}
                            sjsPath={currentStage.sjsThemeFileUrl}
                            layoutOptions={{showTitle: true}}
                        />
                    )}
                </>
            )}
        </>
    );
}
