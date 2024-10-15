import React from 'react';
import {Flex, Box, Stack, Button} from "@chakra-ui/react";
import {NavigationProps} from "@/components/surveyjs/SurveyProps";
import {motion} from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SaveIcon from "@mui/icons-material/Save";
import DoneIcon from "@mui/icons-material/Done"; // Import the custom hook

// Create a motion.div to animate the filling of the progress bar
const MotionButton = motion(Button);

const BottomNavigation: React.FC<NavigationProps> = ({
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
                                                     }) => {
    return (
        <Box p={4} borderRadius="lg" w="100%">
            <Flex justify="space-between" align="center" w="100%">
                {/* Left section: Previous and Next buttons */}
                {pageListOptions.length > 1 && (
                    <Stack direction="row" spacing={4}>
                        <MotionButton
                            fontSize={'sm'}
                            onClick={prevPage}
                            disabled={isFirstPage}
                            leftIcon={<ArrowBackIcon/>}
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                        >
                            Previous
                        </MotionButton>

                        <MotionButton
                            fontSize={'sm'}
                            onClick={nextPage}
                            rightIcon={<ArrowForwardIcon/>}
                            disabled={isLastPage}
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                        >
                            Next
                        </MotionButton>
                    </Stack>
                )
                }

                {/* Right section: Save and Submit buttons */}
                <Stack direction="row" spacing={4}>
                    <MotionButton
                        fontSize={'sm'}
                        onClick={() => {
                            window.alert("Implement Saving")
                        }}
                        leftIcon={<SaveIcon/>}
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                    >
                        Save
                    </MotionButton>

                    {isEditing && (
                        <MotionButton
                            fontSize={'sm'}
                            onClick={submitSurvey}
                            leftIcon={<DoneIcon/>}
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                        >
                            Submit
                        </MotionButton>
                    )}
                </Stack>
            </Flex>
        </Box>
    );
};

export default BottomNavigation;
