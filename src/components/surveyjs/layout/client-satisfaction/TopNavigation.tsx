"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  Box,
  Flex,
  IconButton,
  Circle,
  Tooltip,
  Text,
  useTheme,
} from "@chakra-ui/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FirstPage,
  LastPage,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { PageModel } from "survey-core";

const MotionFlex = motion(Flex);

interface PageInfo {
  page: PageModel;
  title: string;
}

interface TopNavigationProps {
  pages: PageInfo[];
  currentPage: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  jumpToPage: (page: PageModel) => void;
  prevPage: () => void;
  nextPage: () => void;
}

const TopNavigation: React.FC<TopNavigationProps> = ({
  pages,
  currentPage,
  isFirstPage,
  isLastPage,
  jumpToPage,
  prevPage,
  nextPage,
}) => {
  const theme = useTheme();
  const [maxPage, setMaxPage] = useState(currentPage);

  const pagesAllowed = 5;

  const totalPages = pages.length;
  const handleFirst = () => jumpToPage(pages[0].page);
  const handleLast = () => jumpToPage(pages[totalPages - 1].page);

  const itemSize = 100;
  const gapSize = 8;
  const totalItemSize = itemSize + gapSize;
  const totalBarSize = pagesAllowed * totalItemSize;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [offSet, setOffset] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      requestAnimationFrame(() => {
        if (containerRef.current) {
          setContainerWidth(containerRef.current.offsetWidth);
        }
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!containerWidth) return;

    const centerOfCurrentItem = currentPage * totalItemSize + itemSize / 2;
    let newOffset = centerOfCurrentItem - containerWidth / 2;

    const maxOffset = pages.length * totalItemSize - containerWidth;
    if (newOffset < 0) newOffset = 0;
    if (newOffset > maxOffset) newOffset = maxOffset;

    setOffset(newOffset);
  }, [
    currentPage,
    containerWidth,
    itemSize,
    gapSize,
    totalItemSize,
    pages.length,
  ]);

  useEffect(() => {
    if (currentPage > maxPage) {
      setMaxPage(currentPage);
    }
  }, [currentPage]);

  return (
    <Box
      position="sticky"
      top="0"
      zIndex={90}
      w="full"
      bg={theme.colors.elementBG}
      borderRadius="md"
      borderBottom="1px solid"
      borderColor={theme.colors.primary}
      px={[2, 4]}
      py={[2, 3]}
      boxShadow="md"
    >
      <Flex justify="center" align="center" gap={[1, 2]}>
        {/* Left Navigation Controls */}
        <IconButton
          aria-label="First page"
          icon={<FirstPage />}
          onClick={handleFirst}
          isDisabled={isFirstPage}
          variant="ghost"
          size={["xs", "sm"]}
        />
        <IconButton
          aria-label="Previous"
          icon={<ArrowLeft />}
          onClick={prevPage}
          isDisabled={isFirstPage}
          variant="ghost"
          size={["xs", "sm"]}
        />

        <Box maxW={`${totalBarSize}px`} overflow={"hidden"} ref={containerRef}>
          <Flex
            justify={"flex-start"}
            align={"flex-start"}
            gap={`${gapSize}px`}
            transform={"auto"}
            translateX={`-${offSet}px`}
            transition={"transform 0.3s ease-out"}
          >
            {pages.map(({ page, title }, index) => {
              const isCompleted = index < maxPage;
              const isCurrent = index === currentPage;
              const isNotStarted = index > currentPage;

              // Circle background color:
              let circleBg = "gray.200";
              let circleColor = "gray.700"; // text/icon color
              let circleContent: React.ReactNode = index + 1; // default label

              if (isCompleted) {
                circleBg = "green.500";
                circleColor = "white";
                circleContent = <Check fontSize="small" />;
              } else if (isCurrent) {
                circleBg = "yellow.400";
                circleColor = "white";
                // could show numeric label or something like a spinner icon, etc.
              } else if (isNotStarted) {
                circleBg = "gray.200";
                circleColor = "gray.600";
              }

              return (
                <Flex
                  key={index}
                  direction="column"
                  align="center"
                  justify="flex-start"
                  flexShrink={0}
                  w={`${itemSize}px`}
                >
                  <Tooltip label={title} hasArrow>
                    <Circle
                      size={"28px"}
                      bg={circleBg}
                      color={circleColor}
                      fontWeight="bold"
                      cursor="pointer"
                      onClick={() => jumpToPage(page)}
                      border={
                        isCurrent
                          ? "2px solid white"
                          : isCompleted
                            ? "2px solid transparent"
                            : "none"
                      }
                      boxShadow={
                        isCurrent ? "0 0 0 2px rgba(0,0,0,0.2)" : "none"
                      }
                      transition="background-color 0.2s"
                    >
                      {circleContent}
                    </Circle>
                  </Tooltip>
                  <Box
                    fontSize={"xs"}
                    mt={1}
                    textAlign="center"
                    whiteSpace="normal"
                    wordBreak="normal"
                    lineHeight="short"
                  >
                    <Text
                      color={
                        isCompleted
                          ? "green.700"
                          : isCurrent
                            ? "yellow.800"
                            : "gray.600"
                      }
                    >
                      {title}
                    </Text>
                  </Box>
                </Flex>
              );
            })}
          </Flex>
        </Box>
        <IconButton
          aria-label="Next"
          icon={<ArrowRight />}
          onClick={nextPage}
          isDisabled={isLastPage}
          variant="ghost"
          size={["xs", "sm"]}
        />
        <IconButton
          aria-label="Last page"
          icon={<LastPage />}
          onClick={handleLast}
          isDisabled={isLastPage}
          variant="ghost"
          size={["xs", "sm"]}
        />
      </Flex>
    </Box>
  );
};

export default TopNavigation;
