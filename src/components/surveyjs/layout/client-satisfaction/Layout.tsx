import React from "react";
import { Survey } from "survey-react-ui";
import { Flex, Box, Button, useTheme } from "@chakra-ui/react";
import useSurveyNavigation from "@/components/surveyjs/useSurveyNavigation";
import { ClientSatisfactionLayoutProps } from "@/types/surveyJs";
import SurveyNavigationGuard from "@/components/surveyjs/SurveyNavigationGuard";
import { useUser } from "@/providers/UserProvider";
import { useWorkflow } from "@/providers/WorkflowProvider";
import TopNavigation from "@/components/surveyjs/layout/client-satisfaction/TopNavigation";
import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";

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
  const theme = useTheme();

  return (
    <SurveyNavigationGuard
      isEditing={isEditing}
      setToDisplayMode={switchToDisplayMode}
      setToEditMode={switchToEditMode}
    >
      <Box h={"500px"} pb={"30px"}>
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
          direction="row"
          justify={"flex-start"}
          align={"flex-start"}
          flexWrap={"wrap"}
          w={"full"}
          gap={2}
          mt={2}
        >
          <Box flex={1} mt={2} position={"sticky"} top={"100px"}>
            <LetterFlyIn>Client Satisfaction</LetterFlyIn>
          </Box>
          <Box
            flex={1}
            bg={theme.colors.elementBG}
            borderRadius="md"
            px={[2, 4]}
            py={[2, 3]}
            boxShadow="md"
            minWidth={["full", "45%"]}
          >
            <Survey model={model} />
            <Flex justify={"space-between"}>
              <Flex gap={2}>
                <Button onClick={prevPage}>Prev</Button>
                <Button onClick={nextPage}>Next</Button>
              </Flex>
              <Flex gap={2}>
                <Button onClick={saveSurvey}>Save</Button>
                <Button onClick={submitSurvey}>Submit</Button>
              </Flex>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </SurveyNavigationGuard>
  );
};

export default ClientSatisfactionLayout;
