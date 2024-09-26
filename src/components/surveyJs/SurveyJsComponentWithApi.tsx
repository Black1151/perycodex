"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/surveyJs/layouts/AdminLayout";
import useSurvey from "@/components/surveyJs/useSurvey";
import "survey-core/defaultV2.min.css";

interface SurveyJsComponentProps {
  jsonSchema: any;
  endpoint: string;
  isNew: boolean;
  dataset?: Record<string, any>;
  title?: string;
  layout?: string;
  onSurveyComplete?: () => void;
  excludeKeys?: string[];
  redirectUrl?: string;
  userTypeIdAllowedToEdit?: number[];
  userAllowedToEditCheck?: () => boolean;
}

const SurveyJsComponent: React.FC<SurveyJsComponentProps> = ({
  jsonSchema,
  endpoint,
  isNew,
  dataset,
  title,
  layout = "admin",
  onSurveyComplete,
  excludeKeys,
  redirectUrl,
  userTypeIdAllowedToEdit,
  userAllowedToEditCheck,
}) => {
  const user = {
    userTypeId: 1,
  };

  const [isEditing, setIsEditing] = useState<boolean>(isNew);

  const canEdit = (() => {
    const userTypeIdCheck =
      userTypeIdAllowedToEdit && userTypeIdAllowedToEdit.length > 0
        ? userTypeIdAllowedToEdit.includes(user!.userTypeId)
        : true;

    const userAllowedCheck = userAllowedToEditCheck
      ? userAllowedToEditCheck()
      : true;

    return userTypeIdCheck && userAllowedCheck;
  })();

  const {
    survey,
    pageNo,
    setPageNo,
    pageListOptions,
    prevPage,
    nextPage,
    jumpToPage,
    submitForm,
    cancelForm,
    handleToggleEdit,
    PageList,
    PageSelector,
  } = useSurvey({
    jsonSchema: jsonSchema,
    isEditing: isEditing,
    setIsEditing: setIsEditing,
    isNew: isNew,
    endpoint: endpoint,
    dataset: dataset,
    onSurveyComplete: onSurveyComplete,
    excludeKeys: excludeKeys,
    redirectUrl: redirectUrl,
  });

  let LayoutComponent;

  switch (layout) {
    case "admin":
      LayoutComponent = AdminLayout;
      break;
    default:
      LayoutComponent = AdminLayout;
      break;
  }

  return (
    <LayoutComponent
      survey={survey}
      isEditing={isEditing}
      isNew={isNew}
      setIsEditing={setIsEditing}
      title={title}
      pageNo={pageNo}
      setPageNo={setPageNo}
      prevPage={prevPage}
      nextPage={nextPage}
      jumpToPage={jumpToPage}
      submitForm={submitForm}
      cancelForm={cancelForm}
      handleToggleEdit={handleToggleEdit}
      canEdit={canEdit}
      PageList={PageList}
      PageSelector={PageSelector}
      pageListOptions={pageListOptions}
    />
  );
};

export default SurveyJsComponent;
