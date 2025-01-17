import React from "react";
import { Survey } from "survey-react-ui";
import { Button, Flex, Heading, Image } from "@chakra-ui/react";
import useSurveyNavigation from "@/components/surveyjs/useSurveyNavigation";
import { eNPSLayoutProps } from "@/types/surveyJs";
import SurveyNavigationGuard from "@/components/surveyjs/SurveyNavigationGuard";
import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";
import { useUser } from "@/providers/UserProvider";

const ENPSLayout: React.FC<eNPSLayoutProps> = ({ model, dataset, canEdit }) => {
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

  const { user } = useUser();

  return (
    <SurveyNavigationGuard
      isEditing={isEditing}
      setToDisplayMode={switchToDisplayMode}
      setToEditMode={switchToEditMode}
    >
      <Flex
        direction="column"
        justify={"center"}
        align={"center"}
        height={"full"}
      >
        {/*TODO: this could be tool logo instead of hard coded*/}
        <Image
          src="/images/Perygon_Happiness_score_icon.png"
          maxW="150px"
          maxH="150px"
          mb={8}
          alt="eNPS Icon"
        />
        <Heading
          as="h1"
          fontFamily="Metropolis"
          fontWeight={300}
          fontSize={[18, 18, 36]}
          color={"white"}
          textAlign={"center"}
        >
          How likely is it that you would{" "}
          <LetterFlyIn
            whiteSpace={"wrap"}
            fontSize={36}
            duration={0.5}
            fontWeight={400}
          >
            RECOMMEND
          </LetterFlyIn>{" "}
          {user?.customerName ? user.customerName : "our company"} as a place to
          work?
        </Heading>
        <Survey model={model} />
        {/* Submit Button */}
        {isEditing && (
          <Button
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
        )}
      </Flex>
    </SurveyNavigationGuard>
  );
};

export default ENPSLayout;
