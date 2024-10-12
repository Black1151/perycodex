import React, {useEffect, useState} from 'react';
import {Box, Flex} from "@chakra-ui/react";
import {Survey} from "survey-react-ui";
import {motion} from 'framer-motion'; // Import framer-motion for animations
import TopAdminNavigation from "@/components/surveyJs/layouts/TopAdminNavigation";
import {LayoutProps} from "@/components/surveyJs/LayoutProps";
import BottomAdminNavigation from "@/components/surveyJs/layouts/BottomAdminNavigation";

const MotionBox = motion(Box); // Create a motion-wrapped Box for animations

const AdminLayout: React.FC<LayoutProps> = ({
                                                survey,
                                                title,
                                                isEditing,
                                                isNew,
                                                setIsEditing,
                                                pageNo,
                                                setPageNo,
                                                jumpToPage,
                                                prevPage,
                                                nextPage,
                                                submitForm,
                                                cancelForm,
                                                canEdit,
                                                handleToggleEdit,
                                                pageListOptions
                                            }) => {
    const [isAnimating, setIsAnimating] = useState(false); // State to control animation
    const [direction, setDirection] = useState(1); // 1 for next page, -1 for previous page

    useEffect(() => {
        // Listen for SurveyJS page change event
        const handlePageChange = () => {
            setIsAnimating(true); // Start animation when page changes

            // Set the direction based on whether the user is going to the next or previous page
            if (survey.currentPageNo > pageNo) {
                setDirection(1); // Slide from right for next page
            } else {
                setDirection(-1); // Slide from left for previous page
            }

            setTimeout(() => setIsAnimating(false), 500); // Stop animation after fade in/out duration
        };

        // Attach event to survey model
        survey.onCurrentPageChanged.add(handlePageChange);

        // Cleanup on unmount
        return () => {
            survey.onCurrentPageChanged.remove(handlePageChange);
        };
    }, [survey, pageNo]);

    return (
        <>
            <Flex w={'full'} justify={'center'} align={'center'} p={4} position={'relative'} direction={'column'}>
                <Box maxW={'1300px'} w={'80%'} bg={'white'} borderRadius={'lg'} overflow={'hidden'}>
                    {/*Top Navigation*/}
                    <TopAdminNavigation
                        pageListOptions={pageListOptions}
                        pageNo={pageNo}
                        jumpToPage={jumpToPage}
                        isEditing={isEditing}
                        handleToggleEdit={handleToggleEdit}
                        cancelForm={cancelForm}
                    />

                    {/* Motion-animated Survey component with slide transition */}
                    <MotionBox
                        key={pageNo} // Key to ensure it re-renders on page change
                        initial={{
                            x: direction === 1 ? 1000 : -1000,
                            opacity: 0
                        }} // Slide from right if direction is 1 (next), from left if -1 (previous)
                        animate={{x: 0, opacity: 1}} // Animate into place
                        exit={{
                            x: direction === 1 ? -1000 : 1000,
                            opacity: 0
                        }} // Slide out to left if direction is 1 (next), to right if -1 (previous)
                        transition={{duration: 0.5}} // Duration for the slide and fade-in/out
                    >
                        <Survey
                            model={survey}
                            currentPageNo={pageNo}
                        />
                    </MotionBox>

                    {/* Bottom Navigation */}
                    <BottomAdminNavigation
                        pageNo={pageNo}
                        prevPage={prevPage}
                        nextPage={nextPage}
                        isEditing={isEditing}
                        submitForm={submitForm}
                        saveForm={() => { /* handle save logic here */
                        }}
                        totalPageCount={survey.pageCount}
                    />
                </Box>
            </Flex>
        </>
    );
};

export default AdminLayout;
