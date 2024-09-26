"use client";

import { Model, Serializer, settings, SurveyModel } from "survey-core";
import {
  registerSurveyFunctionsWithoutSurvey,
  registerSurveyJsFunctionsWithSurvey,
} from "@/components/surveyJs/customSurveyJsFunctions";
import {
  Box,
  Button,
  Flex,
  Select,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
    settings.web.onBeforeRequestChoices = (sender, options) => {
      options.request.withCredentials = true;
      options.request.setRequestHeader("Accept", "application/json");
    };

    Serializer.findProperty("choicesByUrl", "allowEmptyResponse").defaultValue =
      true;
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
    };

    const surveyModel = {
      ...defaultSurveyOptions,
      ...jsonSchema,
    };

    const survey = new Model(surveyModel);
    survey.setVariable("setUserDetails", user);

    if (dataset) {
      survey.data = dataset;
    }

    if (!isEditing) {
      survey.mode = "display";
    }

    survey.clearInvisibleValues = false;

    return survey;
  };

  async function sendSurveyData(
    requestType: "POST" | "PUT",
    endpoint: string,
    filteredSurveyData: object
  ) {
    const response = await fetch(`/api/surveyjs${endpoint}`, {
      method: requestType,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filteredSurveyData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to send survey data");
    }

    return response.json();
  }

  const handleSurveySubmission = async (sender: SurveyModel) => {
    const requestType = isNew ? "POST" : "PUT";
    console.log(requestType);
    console.log(sender.data);

    let filteredSurveyData = { ...sender.data };

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
      sendSurveyData(requestType, endpoint, filteredSurveyData);

      toast({
        title: "Submitted sucessfully.",
        description: "The record has been successfully submitted.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });

      if (onSurveyComplete) {
        onSurveyComplete();
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

  initGlobalSettings();

  registerSurveyFunctionsWithoutSurvey();
  const [survey] = useState(createSurveyModel());

  registerSurveyJsFunctionsWithSurvey(survey);

  useEffect(() => {
    survey.onComplete.add(handleSurveySubmission);
    return () => {
      survey.onComplete.remove(handleSurveySubmission);
    };
  }, []);

  survey.onCurrentPageChanged.add((_, options) => {
    setPageNo(options.newCurrentPage.visibleIndex);
  });
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
  survey.onValueChanged.add(updatePageListOptions);
  survey.onPageVisibleChanged.add(updatePageListOptions);

  const handleToggleEdit = () => {
    survey.mode = "edit";
    setIsEditing(true);
    updatePageListOptions();
  };

  const submitForm = () => {
    if (!survey.validate(true, true)) {
      survey.focusOnFirstError;
      return 0;
    }

    if (!survey.isCurrentPageHasErrors) {
      if (!survey.completeLastPage()) {
        survey.focusOnFirstError;
        return;
      }
      survey.clear(false, false);
      survey.render();
      setIsEditing(false);
    } else {
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
              w={2}
              h={2}
              bg={page.index === pageNo ? "green" : ""}
              borderRadius={"full"}
              mr={2}
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
