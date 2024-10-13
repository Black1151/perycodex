import React, {useEffect, useState} from 'react';
import {Flex, Box, Text, Stack} from "@chakra-ui/react";
import SurveyModal from "@/components/surveyjs/layout/default/SurveyModal";
import {NavigationProps} from "@/components/surveyjs/SurveyProps";
import useModal from "@/components/surveyjs/useModal";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CancelIcon from "@mui/icons-material/Cancel";
import {motion} from "framer-motion"; // Import the custom hook

// Create a motion.div to animate the filling of the progress bar
const MotionBox = motion(Box);

const animationDuration = 0.5; // Define the duration of the animation in seconds

const TopNavigation: React.FC<NavigationProps> = ({
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
    const {isOpen, openModal, closeModal} = useModal(); // Use the hook
    const previousPageNo = React.useRef(currentPage);

    const handleCancelEdit = () => {
        switchToDisplayMode();
        closeModal();
    };

    useEffect(() => {
        previousPageNo.current = currentPage; // Update the previous page number after render
    }, [currentPage]);

    // Update selectedPage when currentPage changes
    useEffect(() => {
        setCurrentPage(currentPage);
    }, [currentPage]);


    return (
        <Box bg="white" p={4} borderRadius="lg" w="100%">
            <Stack spacing={4}>
                {/* Page List */}
                <Flex justifyContent="space-between" alignItems="center">
                    {/* Left Icon */}
                    <Box maxW={'50px'}>
                        {isEditing ? <EditIcon/> : <VisibilityIcon/>}
                    </Box>
                    {/* Page List Options */}
                    <Flex justifyContent="space-between" alignItems="flex-start" w="100%">
                        {pageListOptions.map((pageOption) => {
                            const isFilled = currentPage >= pageOption.index;
                            const isGoingForward = currentPage > previousPageNo.current;
                            const isGoingBackward = currentPage < previousPageNo.current;

                            const forwardDelay = pageOption.index * animationDuration;
                            const backwardDelay = (pageListOptions.length - pageOption.index - 1) * animationDuration;

                            const delay = isGoingForward
                                ? forwardDelay
                                : isGoingBackward
                                    ? backwardDelay
                                    : 0;

                            return (
                                <Flex
                                    key={pageOption.index}
                                    textAlign="center"
                                    flex={1}
                                    mx={2}
                                    px={4}
                                    flexDirection="column"
                                    alignItems="center"
                                    justifyContent="flex-start"
                                    minW="85px"
                                    maxW="95%"
                                    height="full"
                                >
                                    <Box position="relative" w="100%" h="16px" bg="gray.300" borderRadius="lg" mb={2}>
                                        <MotionBox
                                            position="absolute"
                                            top={0}
                                            left={0}
                                            h="100%"
                                            bg="green.400"
                                            borderRadius="lg"
                                            initial={{width: 0}}
                                            animate={{width: isFilled ? '100%' : '0%'}}
                                            transition={{
                                                duration: animationDuration,
                                                ease: 'linear',
                                                delay,
                                            }}
                                        />
                                    </Box>

                                    <Text
                                        cursor="pointer"
                                        color={currentPage === pageOption.index ? 'perygonPink' : 'gray.500'}
                                        fontWeight={currentPage === pageOption.index ? 'bold' : 'normal'}
                                        fontSize="xs"
                                        onClick={() => jumpToPage(pageOption.page)}
                                    >
                                        {pageOption.title}
                                    </Text>
                                </Flex>
                            );
                        })}
                    </Flex>

                    {/* Right Icon - Attach onClick to the icons */}
                    <Box maxW={'50px'}>
                        {isEditing ? (
                            <CancelIcon
                                cursor="pointer"
                                onClick={openModal}
                            />
                        ) : (
                            <EditIcon
                                cursor="pointer"
                                onClick={switchToEditMode}
                            />
                        )}
                    </Box>
                </Flex>
            </Stack>
            <SurveyModal
                isOpen={isOpen}
                onClose={closeModal}
                onConfirm={handleCancelEdit}
                title="Confirm Edit Cancellation"
                bodyContent="Are you sure you want to cancel editing? Any unsaved changes will be lost."
                confirmLabel="Yes, Cancel"
                cancelLabel="No, Go Back"
            />
        </Box>
    );
};

export default TopNavigation;
