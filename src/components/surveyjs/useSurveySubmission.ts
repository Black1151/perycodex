"use client";

import { useEffect } from "react";
import { Question, QuestionHtmlModel, SurveyModel } from "survey-core";
import { useToast } from "@chakra-ui/react"; // Assuming Chakra UI's toast is used for notifications
import { useRouter } from "next/navigation";
import { UseSurveySubmissionProps } from "@/types/surveyJs"; // For redirection after submission (if needed)

const useSurveySubmission = ({
  model,
  isNew,
  formSubmission,
  endpoint,
  excludeKeys = [],
  onSurveySuccess,
  surveySuccessMessage,
  onSurveyFailure,
  redirectUrl,
  reloadPageOnSuccess = false,
  isAnonymousSubmission = false,
  onSubmissionResponse,
}: UseSurveySubmissionProps) => {
  const toast = useToast();
  const router = useRouter();

  const buildFilteredSurveyData = (sender: SurveyModel) => {
    if (!sender) return {};

    const allQuestions = sender.getAllQuestions();
    const surveyData = { ...sender.data };

    // Fill in missing question answers with null (excluding HTML questions)
    allQuestions.forEach((question: Question) => {
      if (question instanceof QuestionHtmlModel) return;
      if (!(question.name in surveyData)) {
        surveyData[question.name] = null;
      }
    });

    // Exclude specific keys
    const filteredData = Object.keys(surveyData).reduce(
      (acc, key) => {
        if (!excludeKeys.includes(key)) {
          acc[key] = surveyData[key];
        }
        return acc;
      },
      {} as Record<string, any>,
    );

    return filteredData;
  };

  /*
                        This useEffect will handle the submission logic for the admin screens
                         */
  useEffect(() => {
    if (!model) return;
    if (formSubmission !== "admin") return;

    const handleSurveySubmission = async (sender: SurveyModel) => {
      try {
        let requestType = isNew ? "POST" : "PUT";
        const filteredData = buildFilteredSurveyData(sender);

        const apiUrl =
          requestType === "POST"
            ? `/api/surveyjs${endpoint}`
            : `/api/surveyjs/${endpoint.split("/")[1]}`;

        const payload =
          requestType === "PUT"
            ? {
                uniqueId: endpoint.split("/")[2],
                data: filteredData,
              }
            : filteredData;

        const response = await fetch(apiUrl, {
          method: requestType,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.status === 401) {
          toast({
            title: "Unauthorised",
            description:
              "Your session has timed out, you need to log in again.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-right",
          });
          router.push("/login");
          return null;
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to submit data");
        }

        const result = await response.json();

        // Show success notification
        toast({
          title: "Submitted successfully.",
          description: surveySuccessMessage,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });

        onSurveySuccess?.();

        // Update the model data with the newly submitted data
        model.data = result.data || filteredData;

        if (!isNew) {
          model.clear(false, false);
          model.render();
        }

        if (reloadPageOnSuccess) {
          router.refresh();
        }

        // Handle redirection if a URL is provided
        if (redirectUrl) {
          setTimeout(() => router.push(redirectUrl), 1000);
        }

        return result;
      } catch (error) {
        toast({
          title: "Submission failed.",
          description:
            error instanceof Error ? error.message : "An error occurred.",
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
  }, [
    model,
    endpoint,
    excludeKeys,
    isNew,
    formSubmission,
    surveySuccessMessage,
    reloadPageOnSuccess,
    redirectUrl,
    onSurveySuccess,
    onSurveyFailure,
    toast,
    router,
    buildFilteredSurveyData,
  ]);

  /*
                        This useEffect will handle the submission logic for the workflow screens
                         */
  useEffect(() => {
    if (!model) return;
    if (formSubmission !== "workflow") return;

    const handleSurveySubmission = async (sender: SurveyModel) => {
      try {
        let requestType = "POST";
        const filteredData = buildFilteredSurveyData(sender);
        const apiUrl = endpoint;
        const isSaveMode = (model as any)?.seduloState?.isSave === true;
        const payload = {
          jsonResponse: filteredData,
          isComplete: !isSaveMode,
        };
        if (model.seduloState) {
          model.seduloState.isSave = false;
        }

        const response = await fetch(apiUrl, {
          method: requestType,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.status === 401) {
          toast({
            title: "Unauthorised",
            description:
              "Your session has timed out, you need to log in again.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-right",
          });
          router.push("/login");
          return null;
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to submit data");
        }

        const result = await response.json();

        if (onSubmissionResponse) {
          onSubmissionResponse({
            success: result.success,
            message: result.message,
            data: {
              code: result.code, // -1, 0, 1, 2, 3, 4 (READS THE SUBMISSION RESPONSE)
              ...result.data, // in case you need other info too
            },
          });
        }

        // Show success notification
        toast({
          title: "Submitted successfully.",
          description: surveySuccessMessage,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });

        onSurveySuccess?.(); // Call if provided

        model.data = filteredData;

        model.clear(false, false);
        model.render();

        if (reloadPageOnSuccess) {
          router.refresh();
        }

        // Handle redirection if a URL is provided
        if (redirectUrl) {
          setTimeout(() => router.push(redirectUrl), 1000);
        }

        return result;
      } catch (error) {
        toast({
          title: "Submission failed.",
          description:
            error instanceof Error ? error.message : "An error occurred.",
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
  }, [
    model,
    endpoint,
    excludeKeys,
    isNew,
    formSubmission,
    surveySuccessMessage,
    reloadPageOnSuccess,
    redirectUrl,
    onSurveySuccess,
    onSurveyFailure,
    toast,
    router,
    buildFilteredSurveyData,
    onSubmissionResponse,
  ]);

  return {};
};
export default useSurveySubmission;
