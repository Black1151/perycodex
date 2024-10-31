"use client";

import React, {useEffect, useState} from "react";
import {Box, Center, Spinner, useToast} from "@chakra-ui/react";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {WorkflowStage} from "@/app/(site)/(apps)/happiness-score/workflow/[workflowInstanceId]/page";
import {useFetchClient} from "@/hooks/useFetchClient";
import {LeftHandNavigationDrawer, MenuItem} from "@/components/layout/LeftHandNavigationDrawer";
import {Circle as CircleIcon} from "@mui/icons-material";
import {AnimatePresence, motion} from "framer-motion";

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
    const [localLoading, setLocalLoading] = useState(true); // Set initial loading to true
    const [showContent, setShowContent] = useState(false); // New state to manage content visibility
    const {fetchClient} = useFetchClient();
    const toast = useToast();

    // Prepare menu items based on stages
    const menuItems: MenuItem[] = stages.map((stage) => ({
        label: stage.bpName,
        icon: <CircleIcon/>, // Using MUI's Circle icon
        onClick: () => setCurrentStage(stage),
        category: "Stages",
    }));

    useEffect(() => {
        // Determine the current stage only once on initial render
        if (stages.length === 1) {
            setCurrentStage(stages[0]);
        } else if (stages.length > 1) {
            const orderedStages = stages.sort((a, b) => a.bpOrder - b.bpOrder);
            setCurrentStage(orderedStages.find(stage => stage.stageStatus === "Next") || null);
        }
    }, [stages]);

    useEffect(() => {
        // Fetch form data whenever `currentStage` changes
        const fetchFormData = async () => {
            if (currentStage && currentStage.formId) {
                setShowContent(false);
                setLocalLoading(true);

                const formDataResource = await fetchClient<Form>(`/api/workflows/getForm`, {
                    method: "POST",
                    body: {formId: currentStage.formId},
                    redirectOnError: false,
                    successMessage: "Form data loaded successfully",
                    errorMessage: "Failed to load form data.",
                });

                if (formDataResource) {
                    setCurrentForm(formDataResource);
                } else {
                    setCurrentForm(null);
                }

                setLocalLoading(false); // Stop local loading after fetching
                setShowContent(true); // Show content after loading is complete
            } else {
                // If no valid current stage is found, display loading spinner briefly before showing message
                setTimeout(() => {
                    setLocalLoading(false);
                    setShowContent(false);
                }, 500);
            }
        };

        fetchFormData();
    }, [currentStage]);

    const MotionBox = motion(Box);

    return (
        <Box mt="60px" width="full" height="calc(100vh - 60px)">
            {/* Conditionally render LeftHandNavigationDrawer if there are more than one stage */}
            {stages.length > 1 && (
                <LeftHandNavigationDrawer
                    menuItems={menuItems}
                    defaultDrawerState="half-open"
                />
            )}

            {/* Display the main content */}
            {localLoading ? (
                <Center height="100%">
                    <Spinner size="xl" color="blue.500"/>
                </Center>
            ) : (
                <AnimatePresence mode="wait">
                    {showContent && currentStage && currentForm && (
                        <MotionBox
                            key={currentStage.bpInstId}
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            transition={{duration: 0.5}}
                            height="full"
                        >
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
                        </MotionBox>
                    )}
                </AnimatePresence>
            )}
        </Box>
    );
}
