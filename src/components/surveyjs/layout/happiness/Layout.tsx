import React from "react";
import { Survey } from "survey-react-ui";
import { Button, Flex } from "@chakra-ui/react";
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
        w="100%"
        justify="center"
        align="center"
        // bg={"perygonPink"}
        bg={"transparent"}
        height={"full"}
        width={"full"}
        direction="column"
        p={6}
        zIndex={101}
      >
        <Survey model={model} />
        {/* Submit Button */}
        <Button
          mt={6}
          px={8}
          py={4}
          fontSize="lg"
          fontWeight="bold"
          bgColor="green"
          border="1px solid lightGray"
          color="white"
          _hover={{
            bg: "white",
            color: "green",
            transform: "scale(1.05)",
            border: "1px solid lightGray",
            boxShadow: "lg",
          }}
          borderRadius="full"
          onClick={submitSurvey}
        >
          Submit
        </Button>
      </Flex>
    </SurveyNavigationGuard>
  );
};

export default HappinessLayout;
