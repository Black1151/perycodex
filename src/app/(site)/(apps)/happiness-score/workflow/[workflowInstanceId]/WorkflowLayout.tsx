"use client";

import React, {useEffect, useState} from "react";
import {Box, Center, Spinner, useToast} from "@chakra-ui/react";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {WorkflowStage} from "@/app/(site)/(apps)/happiness-score/workflow/[workflowInstanceId]/page";
import {useFetchClient} from "@/hooks/useFetchClient";
import {LeftHandNavigationDrawer, MenuItem} from "@/components/layout/LeftHandNavigationDrawer";
import {Circle as CircleIcon} from "@mui/icons-material";

interface WorkflowLayoutProps {
    stages: WorkflowStage[];
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

export default function WorkflowLayout({stages}: WorkflowLayoutProps) {
    const [currentStage, setCurrentStage] = useState<WorkflowStage | null>(null);
    const [currentForm, setCurrentForm] = useState<Form | null>(null);
    const {fetchClient} = useFetchClient();
    const toast = useToast();

    // Prepare menu items based on stages
    const menuItems: MenuItem[] = stages.map((stage) => ({
        label: stage.bpName,
        icon: <CircleIcon/>,
        onClick: () => setCurrentStage(stage),
        category: "Stages",
    }));

    useEffect(() => {
        // Set the initial current stage
        if (stages.length === 1) {
            setCurrentStage(stages[0]);
        } else if (stages.length > 1) {
            const orderedStages = stages.sort((a, b) => a.bpOrder - b.bpOrder);
            setCurrentStage(orderedStages.find((stage) => stage.stageStatus === "Next") || null);
        }
    }, [stages]);

    useEffect(() => {
        // Fetch form data whenever `currentStage` changes
        const fetchFormData = async () => {
            if (currentStage?.formId) {
                const formDataResource = await fetchClient<Form>(`/api/workflows/getForm`, {
                    method: "POST",
                    body: {formId: currentStage.formId},
                    redirectOnError: false,
                });

                setCurrentForm(formDataResource || null);
            }
        };

        fetchFormData();
    }, [currentStage]);

    return (
        <Box mt="60px" width="full" height="calc(100vh - 60px)">
            {/* Render LeftHandNavigationDrawer if there are multiple stages */}
            {stages.length > 1 && (
                <LeftHandNavigationDrawer
                    menuItems={menuItems}
                    defaultDrawerState="half-open"
                />
            )}

            {/* Display SurveyComponent if form data is available */}
            {currentStage && currentForm ? (
                <SurveyComponent
                    surveyJson={
                        typeof currentForm.jsonFile === "string"
                            ? JSON.parse(currentForm.jsonFile)
                            : currentForm.jsonFile
                    }
                    endpoint={`/api/workflows/saveWorkflow/${currentStage.bpInstId}`}
                    isNew={true}
                    formSubmission="workflow"
                    layout="happiness"
                    redirectUrl={`/happiness-score?workflowId=1&toolId=1`}
                    jsPath={currentStage.jsAdditionalFileUrl}
                    cssPath={currentStage.cssThemeFileUrl}
                    sjsPath={currentStage.sjsThemeFileUrl}
                    layoutOptions={{showTitle: true}}
                />
            ) : (
                <Center height="100%">
                    <Spinner size="xl" color="blue.500"/>
                </Center>
            )}
        </Box>
    );
}
