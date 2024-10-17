import React from 'react';
import {Flex, Box, Stack, Button, useBreakpointValue} from "@chakra-ui/react";
import {NavigationProps} from "@/components/surveyjs/SurveyProps";
import {motion} from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DoneIcon from "@mui/icons-material/Done";

// Create a motion.div to animate the filling of the progress bar
const MotionButton = motion(Button);

const BottomNavigation: React.FC<NavigationProps> = ({
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
                                                     }) => {
    // Responsive value for the button text; hides text on mobile
    const buttonText = useBreakpointValue({base: '', md: 'Previous'});
    const nextButtonText = useBreakpointValue({base: '', md: 'Next'});
    const submitButtonText = useBreakpointValue({base: '', md: 'Submit'});

    return (
        <Box p={4} borderRadius="lg" w="100%">
            <Flex
                justify={pageListOptions.length <= 1 ? "flex-end" : "space-between"}
                align="center"
                w="100%"
            >
                {/* Left section: Previous and Next buttons */}
                {pageListOptions.length > 1 && (
                    <Stack direction="row" spacing={4}>
                        <MotionButton
                            fontSize={'sm'}
                            onClick={prevPage}
                            disabled={isFirstPage}
                            leftIcon={<ArrowBackIcon/>}
                            bgColor="darkGray"
                            w="full"
                            height={12}
                            border="1px solid darkGray"
                            color="white"
                            _hover={{color: "darkGray", backgroundColor: "white"}}
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                        >
                            {buttonText}
                        </MotionButton>

                        <MotionButton
                            fontSize={'sm'}
                            onClick={nextPage}
                            rightIcon={<ArrowForwardIcon/>}
                            disabled={isLastPage}
                            bgColor="darkGray"
                            w="full"
                            height={12}
                            border="1px solid darkGray"
                            color="white"
                            _hover={{color: "darkGray", backgroundColor: "white"}}
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                        >
                            {nextButtonText}
                        </MotionButton>
                    </Stack>
                )}

                {/* Right section: Submit button */}
                <Stack direction="row" spacing={4}>
                    {isEditing && (
                        <MotionButton
                            fontSize={'sm'}
                            onClick={submitSurvey}
                            leftIcon={<DoneIcon/>}
                            bgColor="green"
                            w="full"
                            height={12}
                            border="1px solid lightGray"
                            color="white"
                            _hover={{color: "green", backgroundColor: "white"}}
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                        >
                            {submitButtonText}
                        </MotionButton>
                    )}
                </Stack>
            </Flex>
        </Box>
    );
};

export default BottomNavigation;
