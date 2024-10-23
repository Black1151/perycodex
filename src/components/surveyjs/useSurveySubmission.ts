'use client';

import {useEffect} from 'react';
import {Question, SurveyModel} from 'survey-core';
import {useToast} from '@chakra-ui/react'; // Assuming Chakra UI's toast is used for notifications
import {useRouter} from 'next/navigation';
import {UseSurveySubmissionProps} from "@/components/surveyjs/SurveyProps"; // For redirection after submission (if needed)

const useSurveySubmission = ({
                                 model,
                                 isNew,
                                 endpoint,
                                 excludeKeys = [],
                                 onSurveySuccess,
                                 onSurveyFailure,
                                 redirectUrl,
                                 reloadPageOnSuccess = false
                             }: UseSurveySubmissionProps) => {
    const toast = useToast();
    const router = useRouter();

    useEffect(() => {
            if (!model) return;
            const handleSurveySubmission = async (sender: SurveyModel) => {
                const requestType = isNew ? "POST" : "PUT";

                const allQuestions: Question[] = model.getAllQuestions();

                const surveyData: { [key: string]: any } = sender.data;

                // Iterate through all questions, checking for missing data and setting it to `null`
                allQuestions.forEach((question: Question) => {
                    const questionName = question.name;

                    // If the question doesn't exist in the data, set it to null
                    if (!(questionName in surveyData)) {
                        surveyData[questionName] = null;
                    }
                });

                let filteredSurveyData = {...surveyData};

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

                    onSurveySuccess?.(); // Call if provided


                    // Update the model data with the newly submitted data
                    model.data = result.data || filteredSurveyData;

                    // Rerender the survey with the updated data
                    if (!isNew) {
                        model.clear(false, false);
                        model.render();
                    }

                    if (reloadPageOnSuccess) {
                        router.refresh()
                    }

                    // Handle redirection if a URL is provided
                    if (redirectUrl) {
                        setTimeout(() => router.push(redirectUrl), 1000);
                    }

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
                    onSurveyFailure?.();
                }
            };

            // Attach the `handleSurveySubmission` function to the survey's onComplete event
            model.onComplete.add(handleSurveySubmission);

            // Cleanup event listener on unmount
            return () => {
                model.onComplete.remove(handleSurveySubmission);
            };
        }, [model, isNew, endpoint, excludeKeys, onSurveySuccess, redirectUrl, toast, router]
    )
    ;

    return {};
};

export default useSurveySubmission;