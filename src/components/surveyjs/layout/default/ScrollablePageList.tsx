import React, {useEffect, useRef, useState} from 'react';
import {Box, Flex, IconButton, Text, useBreakpointValue} from "@chakra-ui/react";
import {ChevronLeft, ChevronRight} from "@mui/icons-material"
import {motion} from "framer-motion";

// Create a motion.div to animate the filling of the progress bar
const MotionBox = motion(Box);

interface PageOption {
    index: number;
    title: string;
    page: number;
}

interface ScrollablePageListProps {
    pageListOptions: PageOption[];
    currentPage: number;
    jumpToPage: (page: number) => void;
    animationDuration: number;
    previousPageNo: React.MutableRefObject<number>;
    width?: string | number; // Width of the toggle switch
}

const ScrollablePageList: React.FC<ScrollablePageListProps> = ({
                                                                   pageListOptions,
                                                                   currentPage,
                                                                   jumpToPage,
                                                                   animationDuration,
                                                                   previousPageNo,
                                                                   width
                                                               }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // Use responsive values for size of Chevron Arrows
    const chevronSize = useBreakpointValue({
        base: '28px', // For mobile screens (base breakpoint)
        md: width || '40px', // Default width or prop width for medium and larger screens
    });

    const barHeight = useBreakpointValue({
        base: 14,
        md: 22
    });

    const handleScroll = () => {
        if (containerRef.current) {
            const {scrollLeft, scrollWidth, clientWidth} = containerRef.current;
            const buffer = 10; // The buffer in pixels to allow before hiding the right arrow

            setCanScrollLeft(scrollLeft > buffer);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - buffer);
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (containerRef.current) {
            const scrollAmount = direction === 'left' ? -150 : 150;
            containerRef.current.scrollBy({left: scrollAmount, behavior: 'smooth'});
        }
    };

    useEffect(() => {
        // Call handleScroll initially to set arrow visibility correctly
        handleScroll();

        // Add a resize observer to handle container size changes
        const resizeObserver = new ResizeObserver(() => {
            handleScroll();
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        // Cleanup the observer when the component unmounts
        return () => {
            if (containerRef.current) {
                resizeObserver.unobserve(containerRef.current);
            }
        };
    }, [pageListOptions]);

    return (
        <Flex
            position="relative"
            alignItems="center"
            flex={'1 1 auto'}
            overflow={'hidden'}
        >
            {/* Scroll Left Arrow */}
            <IconButton
                aria-label="Scroll Left"
                icon={<ChevronLeft sx={{fontSize: chevronSize}}/>}
                position={'sticky'}
                color={canScrollLeft ? 'perygonPink' : 'transparent'}
                left="0"
                zIndex="1"
                bg="transparent"
                height="auto"
                _hover={{bg: 'transparent'}}
                onClick={() => scroll('left')}
            />
            <Flex
                ref={containerRef}
                overflow="auto"
                flex={1}
                onScroll={handleScroll}
                sx={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                }}
            >
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
                            flex={'1'}
                            mx={1}
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="flex-start"
                            minW="85px"
                            // maxW="95%"
                            maxW="300px"
                            height="full"
                            cursor="pointer"
                            onClick={() => jumpToPage(pageOption.page)}
                        >
                            <Box
                                position="relative"
                                w="100%"
                                h={`${barHeight}px`} // This is the height of the progress bar (you can customize)
                                bg="gray.300"
                                mb={2}
                                overflow={'hidden'}
                                display="flex"
                                alignItems="center"
                                borderRadius="md"
                                style={{clipPath: 'polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%, 5% 50%, 0% 0%)'}}
                            >
                                {/* Progress Bar */}
                                <MotionBox
                                    position="relative"
                                    top={0}
                                    left={0}
                                    h="100%"
                                    bg="green.400"
                                    borderRadius="md"
                                    initial={{width: 0}}
                                    animate={{width: isFilled ? '100%' : '0%'}}
                                    transition={{
                                        duration: animationDuration,
                                        ease: 'easeInOut',
                                        delay,
                                    }}
                                    style={{clipPath: 'polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%, 5% 50%, 0% 0%)'}}
                                />
                            </Box>

                            {/* Text Below Progress Bar */
                            }
                            <Text
                                color={currentPage === pageOption.index ? 'perygonPink' : 'gray.500'}
                                fontWeight={currentPage === pageOption.index ? 'bold' : 'normal'}
                                fontSize={currentPage === pageOption.index ? ["xs", "xs", "md"] : 'xs'}
                            >
                                {pageOption.title}
                            </Text>
                        </Flex>
                    );
                })}
            </Flex>
            {/* Scroll Right Arrow */
            }
            <IconButton
                aria-label="Scroll Right"
                icon={<ChevronRight sx={{fontSize: chevronSize}}/>}
                position="sticky"
                color={canScrollRight ? 'perygonPink' : 'transparent'}
                right="0"
                zIndex="1"
                bg="transparent"
                height="auto"
                _hover={{bg: 'transparent'}}
                onClick={() => scroll('right')}
            />
        </Flex>
    )
        ;
};

export default ScrollablePageList;
