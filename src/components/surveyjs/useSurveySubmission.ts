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

  useEffect(() => {
    if (!model) return;
    const handleSurveySubmission = async (sender: SurveyModel) => {
      let requestType = isNew ? "POST" : "PUT";

      if (formSubmission === "workflow") {
        requestType = "POST";
      }

      const allQuestions: Question[] = model.getAllQuestions();

      const surveyData: { [key: string]: any } = sender.data;

      // Iterate through all questions, checking for missing data and setting it to `null`
      allQuestions.forEach((question: Question) => {
        const questionName = question.name;

        // Check if the question type is 'QuestionHtmlModel' and skip it if true
        if (question instanceof QuestionHtmlModel) {
          return; // Skip this iteration
        }

        // If the question doesn't exist in the data, set it to null
        if (!(questionName in surveyData)) {
          surveyData[questionName] = null;
        }
      });

      let filteredSurveyData = { ...surveyData };

      // Exclude specific keys from survey data
      filteredSurveyData = Object.keys(filteredSurveyData)
        .filter((key) => !excludeKeys.includes(key))
        .reduce(
          (acc, key) => {
            acc[key] = filteredSurveyData[key];
            return acc;
          },
          {} as Record<string, any>,
        );

      let apiUrl = "";
      let payload;

      if (formSubmission === "admin") {
        apiUrl =
          requestType === "POST"
            ? `/api/surveyjs${endpoint}`
            : `/api/surveyjs/${endpoint.split("/")[1]}`;

        payload =
          requestType === "PUT"
            ? {
                uniqueId: endpoint.split("/")[2],
                data: filteredSurveyData,
              }
            : filteredSurveyData;
      } else if (formSubmission === "workflow") {
        apiUrl = endpoint;

        const isSaveMode = (model as any)?.seduloState?.isSave === true;

        payload = {
          jsonResponse: filteredSurveyData,
          isComplete: !isSaveMode,
        };

        console.log("-------------------------------------------");
        console.log(model);
        console.log("-------------------------------------------");

        if (model.seduloState) {
          model.seduloState.isSave = false;
        }
      }

      try {
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

        if (onSubmissionResponse && formSubmission === "workflow") {
          onSubmissionResponse({
            success: result.success,
            message: result.message,
            data: {
              code: result.code, // 3 or 4, etc.
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

        // Update the model data with the newly submitted data
        model.data = result.data || filteredSurveyData;

        // Rerender the survey with the updated data
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
        model.mode = "edit"; // Revert to edit mode on error
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
    isNew,
    endpoint,
    excludeKeys,
    onSurveySuccess,
    redirectUrl,
    toast,
    router,
  ]);

  return {};
};
export default useSurveySubmission;
