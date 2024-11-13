import React from "react";
import { Survey } from "survey-react-ui";
import { Flex } from "@chakra-ui/react";
import useSurveyNavigation from "@/components/surveyjs/useSurveyNavigation";
import { HappinessLayoutProps } from "@/components/surveyjs/SurveyProps";
import SurveyNavigationGuard from "@/components/surveyjs/SurveyNavigationGuard";

const HappinessLayout: React.FC<HappinessLayoutProps> = ({
  model,
  dataset,
  canEdit,
  showTitle = false,
}) => {
  const {
    currentPage,
    setCurrentPage,
    nextPage,
    prevPage,
    jumpToPage,
    submitSurvey,
    switchToDisplayMode,
    switchToEditMode,
    pageListOptions,
    isFirstPage,
    isLastPage,
    isEditing,
  } = useSurveyNavigation(model, dataset);

  return (
    <SurveyNavigationGuard
      isEditing={isEditing}
      setToDisplayMode={switchToDisplayMode}
      setToEditMode={switchToEditMode}
    >
      <Flex
        w="full"
        justify="center"
        align="center"
        bg={"perygonPink"}
        height={"full"}
        width={"full"}
        direction="column"
        zIndex={101}
      >
        <Survey model={model} />
      </Flex>
    </SurveyNavigationGuard>
  );
};

export default HappinessLayout;
