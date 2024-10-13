'use client';

import {useEffect} from 'react';
import {SurveyModel} from 'survey-core';
import {useToast} from '@chakra-ui/react'; // Assuming Chakra UI's toast is used for notifications
import {useRouter} from 'next/navigation';
import {UseSurveySubmissionProps} from "@/components/surveyjs/SurveyProps"; // For redirection after submission (if needed)

const useSurveySubmission = ({
                                 model,
                                 isNew,
                                 endpoint,
                                 excludeKeys = [],
                                 onSurveyComplete,
                                 redirectUrl,
                             }: UseSurveySubmissionProps) => {
    const toast = useToast(); // For showing success and error notifications
    const router = useRouter(); // For redirection after survey completion

    useEffect(() => {
            if (!model) return;

            // Handle survey submission
            const handleSurveySubmission = async (sender: SurveyModel) => {
                console.log(endpoint);

                const requestType = isNew ? "POST" : "PUT";
                let filteredSurveyData = {...sender.data};

                // Exclude specific keys from survey data
                filteredSurveyData = Object.keys(filteredSurveyData)
                    .filter(key => !excludeKeys.includes(key))
                    .reduce((acc, key) => {
                        acc[key] = filteredSurveyData[key];
                        return acc;
                    }, {} as Record<string, any>);

                const apiUrl = requestType === "POST"
                    ? `/api/surveyjs${endpoint}`
                    : `/api/surveyjs/${endpoint.split('/')[1]}`;

                const payload = requestType === "PUT"
                    ? {
                        uniqueId: endpoint.split('/')[2],
                        data: filteredSurveyData,
                    }
                    : filteredSurveyData;

                try {
                    const response = await fetch(apiUrl, {
                        method: requestType,
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(payload),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || "Failed to submit data");
                    }

                    const result = await response.json();

                    // Show success notification
                    toast({
                        title: "Submitted successfully.",
                        description: "The record has been successfully submitted.",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                        position: "bottom-right",
                    });

                    onSurveyComplete?.(); // Call if provided
                    redirectUrl && router.push(redirectUrl); // Redirect if a URL is provided

                    // Clear and rerender the survey
                    model.clear(false, false);
                    model.render();

                    return result;

                } catch (error) {
                    model.mode = "edit"; // Revert to edit mode on error
                    toast({
                        title: "Submission failed.",
                        description: error instanceof Error ? error.message : "An error occurred.",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                        position: "bottom-right",
                    });
                }
            };


            // Attach the `handleSurveySubmission` function to the survey's onComplete event
            model.onComplete.add(handleSurveySubmission);

            // Cleanup event listener on unmount
            return () => {
                model.onComplete.remove(handleSurveySubmission);
            };
        }, [model, isNew, endpoint, excludeKeys, onSurveyComplete, redirectUrl, toast, router]
    )
    ;

    return {};
};

export default useSurveySubmission;