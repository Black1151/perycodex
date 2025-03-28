import React from "react";
import { Survey } from "survey-react-ui";
import { Flex, Box, Button } from "@chakra-ui/react";
import useSurveyNavigation from "@/components/surveyjs/useSurveyNavigation";
import { ClientSatisfactionLayoutProps } from "@/types/surveyJs";
import SurveyNavigationGuard from "@/components/surveyjs/SurveyNavigationGuard";
import { useUser } from "@/providers/UserProvider";
import { useWorkflow } from "@/providers/WorkflowProvider";
import TopNavigation from "@/components/surveyjs/layout/client-satisfaction/TopNavigation";

const ClientSatisfactionLayout: React.FC<ClientSatisfactionLayoutProps> = ({
  model,
  dataset,
  canEdit,
}) => {
  const {
    currentPage,
    setCurrentPage,
    nextPage,
    prevPage,
    jumpToPage,
    submitSurvey,
    saveSurvey,
    switchToDisplayMode,
    switchToEditMode,
    pageListOptions,
    isFirstPage,
    isLastPage,
    isEditing,
  } = useSurveyNavigation(model, dataset);

  const { user } = useUser();
  const { currentStage } = useWorkflow();

  return (
    <SurveyNavigationGuard
      isEditing={isEditing}
      setToDisplayMode={switchToDisplayMode}
      setToEditMode={switchToEditMode}
    >
      <TopNavigation
        pages={pageListOptions}
        currentPage={currentPage}
        isFirstPage={isFirstPage}
        isLastPage={isLastPage}
        jumpToPage={jumpToPage}
        prevPage={prevPage}
        nextPage={nextPage}
      />
      <Flex
        direction="column"
        justify={"flex-start"}
        align={"center"}
        height={"full"}
        w={"full"}
        gap={2}
      >
        <Survey model={model} />
      </Flex>
    </SurveyNavigationGuard>
  );
};

export default ClientSatisfactionLayout;
