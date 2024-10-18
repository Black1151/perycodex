import React, {useRef, useState, useEffect} from 'react';
import {Flex, Box, Text, IconButton} from "@chakra-ui/react";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
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
}

const ScrollablePageList: React.FC<ScrollablePageListProps> = ({
                                                                   pageListOptions,
                                                                   currentPage,
                                                                   jumpToPage,
                                                                   animationDuration,
                                                                   previousPageNo,
                                                               }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

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
                icon={<ChevronLeftIcon sx={{fontSize: '40px'}}/>}
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
                    "-ms-overflow-style": "none",
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
                            mx={2}
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="flex-start"
                            minW="85px"
                            maxW="95%"
                            height="full"
                            cursor="pointer"
                            onClick={() => jumpToPage(pageOption.page)}
                        >
                            <Box
                                position="relative"
                                w="100%"
                                h={["14px", "14px", "28px"]}
                                bg="gray.300"
                                borderRadius="2xl"
                                mb={2}
                                overflow={'hidden'}
                            >
                                <MotionBox
                                    position="absolute"
                                    top={0}
                                    left={0}
                                    h="100%"
                                    bg="green.400"
                                    borderRadius="2xl"
                                    initial={{width: 0}}
                                    animate={{width: isFilled ? '100%' : '0%'}}
                                    transition={{
                                        duration: animationDuration,
                                        ease: 'easeInOut',
                                        delay,
                                    }}
                                />
                                {currentPage === pageOption.index &&
                                    <Box
                                        position={'absolute'}
                                        top={'50%'}
                                        left={'50%'}
                                        transform={"translate(-50%, -50%)"}
                                        height={'25%'}
                                        aspectRatio={1}
                                        maxH={'15px'}
                                        borderRadius={'full'}
                                        bg={'white'}
                                    />
                                }
                            </Box>
                            <Text
                                color={currentPage === pageOption.index ? 'perygonPink' : 'gray.500'}
                                fontWeight={currentPage === pageOption.index ? 'bold' : 'normal'}
                                fontSize={currentPage === pageOption.index ? "md" : 'xs'}
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
                icon={<ChevronRightIcon sx={{fontSize: '40px'}}/>}
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
