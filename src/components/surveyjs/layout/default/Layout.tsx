import React, { useEffect, useState } from "react";
import { Survey } from "survey-react-ui";
import TopNavigation from "@/components/surveyjs/layout/default/TopNavigation";
import { Box, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import useSurveyNavigation from "@/components/surveyjs/useSurveyNavigation";
import BottomNavigation from "@/components/surveyjs/layout/default/BottomNavigation";
import { DefaultLayoutProps } from "@/types/surveyJs";
import SurveyNavigationGuard from "@/components/surveyjs/SurveyNavigationGuard";

const MotionBox = motion(Box); // Create a motion-wrapped Box for animations

const DefaultLayout: React.FC<DefaultLayoutProps> = ({
  model,
  dataset,
  canEdit,
  showTopNavigation = true,
  showBottomNavigation = true,
}) => {
  const {
    currentPage,
    setCurrentPage,
    nextPage,
    prevPage,
    jumpToPage,
    submitSurvey,
    cancelSurvey,
    switchToDisplayMode,
    switchToEditMode,
    pageListOptions,
    isFirstPage,
    isLastPage,
    isEditing,
    isSubmitting,
  } = useSurveyNavigation(model, dataset);

  const [direction, setDirection] = useState(1); // 1 for next page, -1 for previous page

  useEffect(() => {
    // Listen for SurveyJS page change event
    const handlePageChange = () => {
      // Set the direction based on whether the user is going to the next or previous page
      if (model.currentPageNo > currentPage) {
        setDirection(1); // Slide from right for next page
      } else {
        setDirection(-1); // Slide from left for previous page
      }
    };

    // Attach event to the model
    model.onCurrentPageChanged.add(handlePageChange);

    // Cleanup on unmount
    return () => {
      model.onCurrentPageChanged.remove(handlePageChange);
    };
  }, [model, currentPage]);

  return (
    <SurveyNavigationGuard
      isEditing={isEditing}
      setToDisplayMode={switchToDisplayMode}
      setToEditMode={switchToEditMode}
    >
      <Flex
        w="full"
        maxW={"100%"}
        px={[0, 0, 0]}
        justify="center"
        align="center"
        py={4}
        position="relative"
        direction="column"
        bgColor="transparent"
      >
        {/* Navigation Component */}
        {showTopNavigation && (
          <TopNavigation
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            nextPage={nextPage}
            prevPage={prevPage}
            jumpToPage={jumpToPage}
            submitSurvey={submitSurvey}
            cancelSurvey={cancelSurvey}
            canEdit={canEdit}
            switchToDisplayMode={switchToDisplayMode}
            switchToEditMode={switchToEditMode}
            pageListOptions={pageListOptions}
            isFirstPage={isFirstPage}
            isLastPage={isLastPage}
            isEditing={isEditing}
            isSubmitting={isSubmitting}
          />
        )}
        <Box w="100%" overflow="hidden" bg={"elementBG"}>
          {/* Motion-animated Survey component with slide transition */}
          <MotionBox
            key={currentPage} // Ensure re-rendering when page changes
            initial={{
              x: direction === 1 ? 1000 : -1000, // Slide from right if next, from left if previous
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x: direction === 1 ? -1000 : 1000, // Exit to left if next, to right if previous
              opacity: 0,
            }}
            transition={{ duration: 0.5 }} // Duration for slide and fade-in/out
            bgColor="elementBG"
          >
            <Box bgColor="elementBG">
              <Survey model={model} />
            </Box>
          </MotionBox>

          {/*    Bottom Navigation*/}
          {showBottomNavigation && (
            <BottomNavigation
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              nextPage={nextPage}
              prevPage={prevPage}
              jumpToPage={jumpToPage}
              submitSurvey={submitSurvey}
              cancelSurvey={cancelSurvey}
              switchToDisplayMode={switchToDisplayMode}
              switchToEditMode={switchToEditMode}
              pageListOptions={pageListOptions}
              isFirstPage={isFirstPage}
              isLastPage={isLastPage}
              isEditing={isEditing}
              isSubmitting={isSubmitting}
            />
          )}
        </Box>
      </Flex>
    </SurveyNavigationGuard>
  );
};

export default DefaultLayout;
