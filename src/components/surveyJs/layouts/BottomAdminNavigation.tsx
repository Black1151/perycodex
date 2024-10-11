'use client';

import React from 'react';
import { Box, Flex, Button, Stack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DoneIcon from '@mui/icons-material/Done'; // Submit icon

interface BottomAdminNavigationProps {
    pageNo: number;
    prevPage: () => void;
    nextPage: () => void;
    isEditing: boolean;
    submitForm: () => void;
    saveForm: () => void;
    totalPageCount: number;
}

const MotionButton = motion(Button);

const BottomAdminNavigation: React.FC<BottomAdminNavigationProps> = ({
                                                                         pageNo,
                                                                         prevPage,
                                                                         nextPage,
                                                                         isEditing,
                                                                         submitForm,
                                                                         saveForm,
                                                                         totalPageCount,
                                                                     }) => {
    return (
        <Box p={4} borderRadius="lg" w="100%">
            <Flex justify="space-between" align="center" w="100%">
                {/* Left section: Previous and Next buttons */}
                <Stack direction="row" spacing={4}>
                    <MotionButton
                        fontSize={'sm'}
                        onClick={prevPage}
                        disabled={pageNo === 0}
                        leftIcon={<ArrowBackIcon />}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Previous
                    </MotionButton>

                    <MotionButton
                        fontSize={'sm'}
                        onClick={nextPage}
                        rightIcon={<ArrowForwardIcon />}
                        disabled={pageNo >= totalPageCount - 1}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Next
                    </MotionButton>
                </Stack>

                {/* Right section: Save and Submit buttons */}
                <Stack direction="row" spacing={4}>
                    <MotionButton
                        fontSize={'sm'}
                        onClick={saveForm}
                        leftIcon={<SaveIcon />}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Save
                    </MotionButton>

                    {isEditing && (
                        <MotionButton
                            fontSize={'sm'}
                            onClick={submitForm}
                            leftIcon={<DoneIcon />}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Submit
                        </MotionButton>
                    )}
                </Stack>
            </Flex>
        </Box>
    );
};

export default BottomAdminNavigation;
