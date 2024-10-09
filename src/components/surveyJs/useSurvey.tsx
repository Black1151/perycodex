"use client";

import {Model, Serializer, settings, SurveyModel} from "survey-core";
import {
    registerSurveyFunctionsWithoutSurvey,
    registerSurveyJsFunctionsWithSurvey,
} from "@/components/surveyJs/customSurveyJsFunctions";
import {Box, Button, Flex, Select, Text, useToast, VStack,} from "@chakra-ui/react";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";

// Theme for now
import {lightSurveyTheme} from "@/theme/surveyJsTheme";

interface UseSurveyProps {
    jsonSchema: any; // Type should ideally be defined based on SurveyJS JSON schema
    dataset?: Record<string, any>;
    isEditing: boolean;
    setIsEditing: (value: boolean) => void;
    isNew: boolean;
    endpoint: string;
    excludeKeys?: string[];
    onSurveyComplete?: () => void;
    redirectUrl?: string;
}

interface ApiError {
    response?: {
        data?: {
            error?: string;
        };
    };
}

interface SurveyPage {
    title: string | null;
    visibleIndex: number;
}

interface PageOption {
    name: string;
    index: number;
}

const useSurvey = ({
                       jsonSchema,
                       dataset,
                       isEditing,
                       setIsEditing,
                       isNew,
                       endpoint,
                       excludeKeys,
                       onSurveyComplete,
                       redirectUrl,
                   }: UseSurveyProps) => {
    const user = {
        userTypeId: 1,
    };

    const toast = useToast();
    const router = useRouter();
    const [pageNo, setPageNo] = useState(0);

    // Set up global settings for SurveyJS
    const initGlobalSettings = () => {
        // Ensure choicesRestful works with authorization
        settings.web.onBeforeRequestChoices = (sender, options) => {
            options.request.withCredentials = true;
            options.request.setRequestHeader("Accept", "application/json");
        };

        // Allow ChoicesByUrl answers to be empty
        Serializer.findProperty("choicesByUrl", "allowEmptyResponse").defaultValue =
            true;

        // Disable caching of previous responses
        // settings.useCachingForChoicesRestful = false;
    };

    // Create the survey model from the JSON schema
    const createSurveyModel = () => {
        const defaultSurveyOptions = {
            widthMode: "responsive",
            fitToContainer: true,
            showQuestionNumbers: false,
            questionErrorLocation: "bottom",
            focusOnFirstError: true,
            checkErrorsMode: "onValueChanged",
            backgroundOpacity: 0,
            showNavigationButtons: false,
            showCompletedPage: false,
            showPageTitles: false
        };

        const surveyModel = {
            ...defaultSurveyOptions,
            ...jsonSchema, // Spread the schema properties
        };

        const survey = new Model(surveyModel); // Instantiate SurveyJS Model

        // Set Common Variables that will be needed within the survey
        survey.setVariable("setUserDetails", user);

        // Applying a theme mapping based on SurveyJS Variables
        survey.applyTheme(lightSurveyTheme);

        // If data exists then apply it here
        if (dataset) {
            survey.data = dataset;
        }

        // Set survey to read only mode depending on state of isEditing
        if (!isEditing) {
            survey.mode = "display";
        }

        // Survey dataset to include fields that are hidden (not default)
        survey.clearInvisibleValues = false;

        return survey;
    };

    async function sendSurveyData(
        requestType: "POST" | "PUT",
        endpoint: string,
        filteredSurveyData: object
    ) {
        if (requestType === "POST") {
            // POST request to /api/surveyjs/<endpoint>
            const response = await fetch(`/api/surveyjs${endpoint}`, {
                method: requestType,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(filteredSurveyData),
            });

            return response.json();
        }

        if (requestType === "PUT") {
            // Handle PUT request
            const parts = endpoint.split('/');
            if (parts.length < 3) {
                throw new Error("Invalid endpoint format for PUT request");
            }

            const endpointPath = `/${parts[1]}`; // Assuming 'endpoint' is the second part
            const uniqueId = parts[2]; // Extracting the unique ID

            const response = await fetch(`/api/surveyjs${endpointPath}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    uniqueId,
                    data: filteredSurveyData
                }),
            });

            return response.json();
        }
    }

    // How to handle the survey submission
    const handleSurveySubmission = async (sender: SurveyModel) => {
        // Needs to check what type of method to use i.e. new=post, update=put
        const requestType = isNew ? "POST" : "PUT";

        let filteredSurveyData = {...sender.data};

        // Exclude specific keys using reduce (preferred approach)
        if (excludeKeys && excludeKeys.length > 0) {
            filteredSurveyData = Object.keys(filteredSurveyData).reduce(
                (acc, key) => {
                    if (!excludeKeys.includes(key)) {
                        acc[key] = filteredSurveyData[key];
                    }
                    return acc;
                },
                {} as Record<string, any>
            );
        }

        try {
            // Send data to the specified endpoint using the appropriate HTTP method
            // const response = await nexusApi[requestType](endpoint, filteredSurveyData);
            sendSurveyData(requestType, endpoint, filteredSurveyData);

            // Show success toast notification
            toast({
                title: "Submitted sucessfully.",
                description: "The record has been successfully submitted.",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom-right",
            });

            // Call the onSurveyComplete callback if provided
            if (onSurveyComplete) {
                onSurveyComplete();
            }

            // Redirect to the specified URL if provided
            if (redirectUrl) {
                router.push(redirectUrl);
            }
        } catch (error: unknown) {
            const apiError = error as ApiError;
            survey.mode = "edit";
            toast({
                title: "Submission failed.",
                description:
                    apiError?.response?.data?.error ||
                    "There was an error submitting the record. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-right",
            });
        }
    };

    // Initialize global settings for SurveyJS
    initGlobalSettings();

    registerSurveyFunctionsWithoutSurvey();

    // Create and return the survey model (Has to be in state for page navigation to work?)
    // const survey = createSurveyModel();
    const [survey] = useState(createSurveyModel());

    registerSurveyJsFunctionsWithSurvey(survey);

    useEffect(() => {
        survey.onComplete.add(handleSurveySubmission);

        // Cleanup function to remove the listeners when the component unmounts
        return () => {
            survey.onComplete.remove(handleSurveySubmission);
        };
    }, []);

    survey.onCurrentPageChanged.add((_, options) => {
        setPageNo(options.newCurrentPage.visibleIndex);
    });

    // Page Navigations
    const nextPage = () => {
        survey.nextPage();
    };
    const prevPage = () => {
        survey.prevPage();
    };
    const jumpToPage = (pageNo: number) => {
        if (survey.currentPage.validate()) {
            setPageNo(pageNo);
        }
    };

    // Get page list options
    const getPageListOptions = (): PageOption[] => {
        return survey.visiblePages.map((page: SurveyPage, i: number) => ({
            name: page.title || `Page ${i + 1}`,
            index: i,
        }));
    };
    const [pageListOptions, setPageListOptions] = useState(getPageListOptions());

    const updatePageListOptions = () => {
        setPageListOptions(getPageListOptions());
    };

    // Update page list options when the value changes or page visibility changes
    survey.onValueChanged.add(updatePageListOptions);
    survey.onPageVisibleChanged.add(updatePageListOptions);

    const handleToggleEdit = () => {
        survey.mode = "edit";
        setIsEditing(true);
        updatePageListOptions();
    };

    const submitForm = () => {
        // Validate the entire survey before submitting
        if (!survey.validate(true, true)) {
            survey.focusOnFirstError;
            return 0;
        }

        if (!survey.isCurrentPageHasErrors) {
            if (!survey.completeLastPage()) {
                survey.focusOnFirstError;
                return;
            }

            // Assuming the form is complete and valid
            survey.clear(false, false);
            survey.render();
            setIsEditing(false);
            survey.mode = "display";
        } else {
            // If there are errors, focus on the first page with an error
            survey.focusOnFirstError;
        }
    };

    const cancelForm = () => {
        if (dataset) {
            survey.data = dataset;
        }
        setIsEditing(false);
        survey.mode = "display";
    };

    const PageSelector = (
        <Select
            value={pageNo}
            onChange={(evt) => {
                jumpToPage(parseInt(evt.target.value));
            }}
            width={["", "", "full"]}
        >
            {pageListOptions.map((page) => (
                <option key={page.index} value={page.index}>
                    {page.name}
                </option>
            ))}
        </Select>
    );

    // Page list component
    const PageList = (
        <VStack align="stretch" w={"full"}>
            {pageListOptions.map((page) => (
                <Button
                    border={page.index === pageNo ? "1px solid green" : ""}
                    variant={"navbar"}
                    key={page.index}
                    onClick={() => jumpToPage(page.index)}
                >
                    <Flex align={"center"} justify={"flex-start"}>
                        <Box
                            w={2} // Set a fixed width
                            h={2} // Set a fixed height
                            bg={page.index === pageNo ? "green" : ""}
                            borderRadius={"full"}
                            mr={2} // Add some margin to the right for spacing
                        />
                        <Text m={0} p={0}>
                            {page.name}
                        </Text>
                    </Flex>
                </Button>
            ))}
        </VStack>
    );

    return {
        survey,
        pageListOptions,
        prevPage,
        nextPage,
        jumpToPage,
        handleToggleEdit,
        submitForm,
        cancelForm,
        PageSelector,
        PageList,
        pageNo,
        setPageNo,
    };
};

export default useSurvey;
