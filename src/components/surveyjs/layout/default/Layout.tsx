import React, {useEffect, useState} from 'react';
import {Survey} from 'survey-react-ui';
import TopNavigation from "@/components/surveyjs/layout/default/TopNavigation";
import {Box, Flex} from "@chakra-ui/react";
import {motion} from "framer-motion";
import useSurveyNavigation from "@/components/surveyjs/useSurveyNavigation";
import BottomNavigation from "@/components/surveyjs/layout/default/BottomNavigation";
import {DefaultLayoutProps, LayoutProps} from "@/components/surveyjs/SurveyProps";

const MotionBox = motion(Box); // Create a motion-wrapped Box for animations

const DefaultLayout: React.FC<DefaultLayoutProps> = ({
                                                         model,
                                                         dataset,
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
        switchToDisplayMode,
        switchToEditMode,
        pageListOptions,
        isFirstPage,
        isLastPage,
        isEditing,
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
        <Flex w="full" justify="center" align="center" py={4} position="relative" direction="column">
            <Box maxW={['98%', '98%', '98%']} w="100%" bg="white" borderRadius="lg" overflow="hidden">
                {/* Navigation Component */}
                {showTopNavigation &&
                    <TopNavigation
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        nextPage={nextPage}
                        prevPage={prevPage}
                        jumpToPage={jumpToPage}
                        submitSurvey={submitSurvey}
                        switchToDisplayMode={switchToDisplayMode}
                        switchToEditMode={switchToEditMode}
                        pageListOptions={pageListOptions}
                        isFirstPage={isFirstPage}
                        isLastPage={isLastPage}
                        isEditing={isEditing}
                    />
                }

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
                    transition={{duration: 0.5}} // Duration for slide and fade-in/out
                >
                    <Box>
                        <Survey model={model}/>
                    </Box>
                </MotionBox>


                {/*    Bottom Navigation*/}
                {showBottomNavigation &&
                    <BottomNavigation
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        nextPage={nextPage}
                        prevPage={prevPage}
                        jumpToPage={jumpToPage}
                        submitSurvey={submitSurvey}
                        switchToDisplayMode={switchToDisplayMode}
                        switchToEditMode={switchToEditMode}
                        pageListOptions={pageListOptions}
                        isFirstPage={isFirstPage}
                        isLastPage={isLastPage}
                        isEditing={isEditing}
                    />
                }
            </Box>
        </Flex>
    );
};

export default DefaultLayout;
