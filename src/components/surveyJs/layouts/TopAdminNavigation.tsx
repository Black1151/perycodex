'use client';

import React, {useEffect} from 'react';
import {Box, Flex, Stack, Text} from '@chakra-ui/react';
import {motion} from 'framer-motion';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CancelIcon from '@mui/icons-material/Cancel'; // Make sure to import the correct Cancel icon

interface PageOption {
    name: string;
    index: number;
}

interface TopAdminNavigationProps {
    pageListOptions: PageOption[];
    pageNo: number;
    jumpToPage: (pageNo: number) => void;
    isEditing: boolean;
    handleToggleEdit: () => void;
    cancelForm: () => void;
}

// Create a motion.div to animate the filling of the progress bar
const MotionBox = motion(Box);

const animationDuration = 0.5; // Define the duration of the animation in seconds

const TopAdminNavigation: React.FC<TopAdminNavigationProps> = ({
                                                                   pageListOptions,
                                                                   pageNo,
                                                                   jumpToPage,
                                                                   isEditing,
                                                                   handleToggleEdit,
                                                                   cancelForm
                                                               }) => {
    const previousPageNo = React.useRef(pageNo);

    useEffect(() => {
        previousPageNo.current = pageNo; // Update the previous page number after render
    }, [pageNo]);

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
                    {pageListOptions.map((pageOption) => {
                        const isFilled = pageNo >= pageOption.index;
                        const isGoingForward = pageNo > previousPageNo.current;
                        const isGoingBackward = pageNo < previousPageNo.current;

                        // Calculate delay for forward and backward animations
                        const forwardDelay = pageOption.index * animationDuration; // Delay for forward animation
                        const backwardDelay = (pageListOptions.length - pageOption.index - 1) * animationDuration; // Reverse delay for backward

                        const delay = isGoingForward
                            ? forwardDelay // Delay increases for forward animation
                            : isGoingBackward
                                ? backwardDelay // Delay increases for reverse animation
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
                                justifyContent="center"
                                minW="85px"
                                maxW="90%"
                            >
                                {/* Static Gray Background Bar */}
                                <Box
                                    position="relative"
                                    w="100%"
                                    h="4px"
                                    bg="gray.300" // Static gray background
                                    borderRadius="lg"
                                    mb={2}
                                >
                                    {/* Animated Green Filling Bar */}
                                    <MotionBox
                                        position="absolute"
                                        top={0}
                                        left={0}
                                        h="100%"
                                        bg="green.400" // The filling green color
                                        borderRadius="lg"
                                        initial={{width: 0}}
                                        animate={{
                                            width: isFilled ? '100%' : '0%',
                                        }} // Animate fill or un-fill
                                        transition={{
                                            duration: animationDuration,
                                            ease: 'linear', // Remove easing
                                            delay, // Stagger the animation with calculated delay
                                        }}
                                    />
                                </Box>

                                {/* Page Option Name */}
                                <Text
                                    cursor="pointer"
                                    color={pageNo === pageOption.index ? 'perygonPink' : 'gray.500'}
                                    fontWeight={pageNo === pageOption.index ? 'bold' : 'normal'}
                                    fontSize={'xs'}
                                    onClick={() => jumpToPage(pageOption.index)}
                                >
                                    {pageOption.name}
                                </Text>
                            </Flex>
                        );
                    })}

                    {/* Right Icon - Attach onClick to the icons */}
                    <Box maxW={'50px'}>
                        {isEditing ? (
                            <CancelIcon
                                cursor="pointer"
                                onClick={cancelForm} // Attach the onClick event here
                            />
                        ) : (
                            <EditIcon
                                cursor="pointer"
                                onClick={handleToggleEdit} // Attach the onClick event here
                            />
                        )}
                    </Box>
                </Flex>
            </Stack>
        </Box>
    );
};

export default TopAdminNavigation;
