"use client";

// React
import React, { useState } from "react";

// Survey JS
import "survey-core/defaultV2.css";
// import "survey-core/survey-core.css";
import { Model } from "survey-core";

// Admin Form
import { AdminFormWrapperProps } from "@/types/form";

// Logic
import useInitialiseForm from "@/components/surveyjs/hooks/useInitialiseForm";
import useFormNavigation from "@/components/surveyjs/hooks/useFormNavigation";
import { FormComponent } from "@/components/surveyjs/FormComponent";
import useAdminFormSubmission from "@/components/surveyjs/hooks/useAdminFormSubmission";
import { useUser } from "@/providers/UserProvider";

const adminSurveyOptions = {
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

const AdminFormWrapper: React.FC<AdminFormWrapperProps> = ({
  formJson,
  data = {},
  layoutConfig = {
    layoutKey: "default",
    layoutProps: {},
  },
  globalVariables = [],
  stylingConfig = {
    sjsFilePath: "",
    cssFilePath: "",
  },
  jsImport = "",
  excludeKeys = [],
  endpoint,
  formSuccessMessage,
  reloadPageOnSuccess,
  redirectUrl,
  isNew,
  isAllowedToEdit,
  onSurveySuccess,
  onSurveyFailure,
}) => {
  const [surveyJSModel] = useState(
    new Model({ ...formJson, ...adminSurveyOptions }),
  );
  const [canEdit, setCanEdit] = useState<boolean>(isAllowedToEdit);

  if (!canEdit) {
    surveyJSModel.mode = "display";
  }

  useInitialiseForm({
    surveyJSModel,
    data,
    globalVariables,
    sjsFilePath: stylingConfig.sjsFilePath,
    cssFilePath: stylingConfig.cssFilePath,
    jsImport,
    isNew,
  });

  const formNavigation = useFormNavigation({ surveyJSModel, data, canEdit });

  useAdminFormSubmission({
    surveyJSModel,
    isNew,
    formSuccessMessage,
    excludeKeys,
    endpoint,
    reloadPageOnSuccess,
    redirectUrl,
    formNavigation,
    onSurveySuccess,
    onSurveyFailure,
  });

  return (
    <>
      <FormComponent
        surveyJSModel={surveyJSModel}
        layoutKey={layoutConfig.layoutKey}
        layoutProps={layoutConfig.layoutProps}
        formNavigation={formNavigation}
      />
    </>
  );
};

export default AdminFormWrapper;
