import React from "react";
import { Survey } from "survey-react-ui";
import { Flex } from "@chakra-ui/react";
import useSurveyNavigation from "@/components/surveyjs/useSurveyNavigation";
import { HappinessLayoutProps } from "@/components/surveyjs/SurveyProps";

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
  );
};

export default HappinessLayout;
