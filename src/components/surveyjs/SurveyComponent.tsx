"use client";

import React, { useEffect, useMemo, useState } from "react";
import "survey-core/defaultV2.css";
import DefaultLayout from "@/components/surveyjs/layout/default/Layout";
import HappinessLayout from "@/components/surveyjs/layout/happiness/Layout";
import { LayoutProps, SurveyComponentProps } from "@/types/surveyJs";
import useSurvey from "@/components/surveyjs/useSurvey";
import useSurveySubmission from "@/components/surveyjs/useSurveySubmission";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useUser } from "@/providers/UserProvider";
import {
  registerSurveyFunctionsWithoutSurvey,
  registerSurveyJsFunctionsWithSurvey,
} from "@/components/surveyjs/globalJsFunctions";
import eNPSLayout from "@/components/surveyjs/layout/enps/Layout";
import ClientSatisfactionLayout from "@/components/surveyjs/layout/client-satisfaction/Layout";
import PerygonCard from "../layout/PerygonCard";

type LayoutMap = {
  [key: string]: React.FC<LayoutProps>;
};

type Role = "CU" | "CL" | "CS" | "CA" | "PA" | "EU";

const SurveyComponent: React.FC<SurveyComponentProps> = ({
  surveyJson,
  layout = "default",
  layoutOptions,
  endpoint,
  formSubmission = "admin",
  isNew,
  dataset,
  rolesCanEdit = ["CU", "CL", "CS", "CA", "PA", "EU"],
  onSurveySuccess,
  surveySuccessMessage,
  onSurveyFailure,
  reloadPageOnSuccess,
  includeVariables,
  excludeKeys,
  redirectUrl,
  cssPath,
  sjsPath,
  jsPath,
  onSubmissionResponse,
}) => {
  const { user } = useUser();

  const canEdit = rolesCanEdit?.includes(user?.role as Role);
  const [cssLoaded, setCssLoaded] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);

  // Memoize the updated surveyJson based on the layout
  const updatedSurveyJson = useMemo(() => {
    if (layout === "default") {
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
        showPageTitles: false,
      };

      return {
        ...surveyJson,
        ...defaultSurveyOptions,
      };
    }

    return surveyJson;
  }, [layout, surveyJson]);

  // Create the first instance of the survey
  const { model, isLoading } = useSurvey({
    surveyJson: updatedSurveyJson,
    isNew: isNew,
    dataset: dataset,
    includeVariables: includeVariables,
    sjsPath: sjsPath,
    jsPath: jsPath,
  });

  // Add survey submission logic
  useSurveySubmission({
    model: model,
    isNew: isNew,
    endpoint: endpoint,
    formSubmission: formSubmission,
    redirectUrl: redirectUrl,
    excludeKeys: excludeKeys,
    onSurveySuccess: onSurveySuccess,
    surveySuccessMessage: surveySuccessMessage,
    onSurveyFailure: onSurveyFailure,
    reloadPageOnSuccess: reloadPageOnSuccess,
    onSubmissionResponse: onSubmissionResponse,
  });

  useEffect(() => {
    const initializeComponent = async () => {
      try {
        // Register JS functions
        registerSurveyFunctionsWithoutSurvey();
        registerSurveyJsFunctionsWithSurvey(model);

        // Dynamically load CSS file
        let linkElement: HTMLLinkElement | null = null;

        if (cssPath) {
          const cssHref = `/cssPath/${cssPath}.css`;
          linkElement = document.createElement("link");
          linkElement.rel = "stylesheet";
          linkElement.href = cssHref;
          document.head.appendChild(linkElement);
        }

        setCssLoaded(true);

        // Clean up CSS on unmount
        return () => {
          if (linkElement) {
            document.head.removeChild(linkElement);
          }
        };
      } finally {
        setReady(true);
      }
    };

    initializeComponent();
  }, [cssPath, model, endpoint, formSubmission, redirectUrl]);

  const layoutMap: LayoutMap = {
    default: DefaultLayout,
    happiness: HappinessLayout,
    enps: eNPSLayout,
    "client-satisfaction": ClientSatisfactionLayout,
    tester: DefaultLayout,
  };

  const SurveyLayout = layoutMap[layout];

  return (
    <>
      {isLoading || !model || !ready ? (
        <Box mt={4} w={"full"} textAlign={"center"}>
          <Spinner color={"white"} />
        </Box>
      ) : (
        <SurveyLayout
          model={model}
          dataset={dataset}
          canEdit={canEdit}
          {...layoutOptions}
        />
      )}
    </>
  );
};

export default SurveyComponent;
