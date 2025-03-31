import React from "react";
import { Survey } from "survey-react-ui";
import {
  Flex,
  Box,
  Button,
  useTheme,
  useBreakpointValue,
} from "@chakra-ui/react";
import useSurveyNavigation from "@/components/surveyjs/useSurveyNavigation";
import { ClientSatisfactionLayoutProps } from "@/types/surveyJs";
import SurveyNavigationGuard from "@/components/surveyjs/SurveyNavigationGuard";
import { useUser } from "@/providers/UserProvider";
import { useWorkflow } from "@/providers/WorkflowProvider";
import TopNavigation from "@/components/surveyjs/layout/client-satisfaction/TopNavigation";
import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";
import { motion } from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DoneIcon from "@mui/icons-material/Done";
import PublishIcon from "@mui/icons-material/Publish";

const MotionButton = motion(Button);

const ClientSatisfactionLayout: React.FC<ClientSatisfactionLayoutProps> = ({
  model,
  dataset,
  canEdit,
  saveAllowed,
  allowAlwaysEdit,
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
  const isMobile = useBreakpointValue({ base: true, md: false });

  const canSave = () => {
    // Assets and Risks after the fact
    if (allowAlwaysEdit && allowAlwaysEdit === true) {
      return true;
    }

    // Save allowed half way through to come back to stage
    if (
      saveAllowed &&
      saveAllowed === true &&
      currentStage?.stageStatus !== "Completed"
    ) {
      return true;
    }

    // CA can update a completed stage
    if (saveAllowed && saveAllowed === true && user?.role === "CA") {
      return true;
    }

    // Default to false unless condition
    return false;
  };

  return (
    <SurveyNavigationGuard
      isEditing={isEditing}
      setToDisplayMode={switchToDisplayMode}
      setToEditMode={switchToEditMode}
    >
      <Flex
        direction="row"
        justify={"flex-start"}
        align={"flex-start"}
        flexWrap={"wrap"}
        w={"full"}
        gap={2}
        mt={2}
      >
        <Box flex={1}>
          <LetterFlyIn fontSize={32}>Client Satisfaction</LetterFlyIn>
        </Box>
        <Box
          flex={2}
          bg={theme.colors.elementBG}
          borderRadius="md"
          px={[2, 4]}
          py={[2, 3]}
          boxShadow="md"
          minWidth={["full", "45%"]}
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
          <Survey model={model} />
          <Flex justify={"space-between"}>
            <Flex gap={2}>
              <MotionButton
                size={isMobile ? "sm" : "md"}
                disabled={isFirstPage}
                bgColor="darkGray"
                w={["2rem", "full"]}
                h={["2rem", "3rem"]}
                border="1px solid darkGray"
                color="white"
                _hover={{ color: "darkGray", backgroundColor: "white" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                display="flex"
                alignItems="center"
                gap={[0, 0, 2]}
                lineHeight={0}
                onClick={prevPage}
              >
                <ArrowBackIcon />
                Previous
              </MotionButton>
              <MotionButton
                size={isMobile ? "sm" : "md"}
                onClick={nextPage}
                disabled={isLastPage}
                bgColor="darkGray"
                w={["2rem", "full"]}
                h={["2rem", "3rem"]}
                border="1px solid darkGray"
                color="white"
                _hover={{ color: "darkGray", backgroundColor: "white" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowForwardIcon />
                Next
              </MotionButton>
            </Flex>
            <Flex gap={2}>
              {canSave() && (
                <MotionButton
                  size={isMobile ? "sm" : "md"}
                  onClick={saveSurvey}
                  bgColor="green"
                  border="1px solid lightGray"
                  w={["2rem", "full"]}
                  h={["2rem", "3rem"]}
                  color="white"
                  _hover={{ color: "green", backgroundColor: "white" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PublishIcon />
                  Save
                </MotionButton>
              )}
              <MotionButton
                size={isMobile ? "sm" : "md"}
                onClick={submitSurvey}
                bgColor="green"
                border="1px solid lightGray"
                w={["2rem", "full"]}
                h={["2rem", "3rem"]}
                color="white"
                _hover={{ color: "green", backgroundColor: "white" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <DoneIcon />
                Submit
              </MotionButton>
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </SurveyNavigationGuard>
  );
};

export default ClientSatisfactionLayout;
