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
          size={["xs", "sm"]}
        />
        <IconButton
          aria-label="Previous"
          icon={<ArrowLeft />}
          onClick={prevPage}
          isDisabled={isFirstPage}
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
                circleBg = theme.colors.seduloGreen;
                circleColor = "white";
                circleContent = <Check fontSize="small" />;
              } else if (isCurrent) {
                circleBg = theme.colors.elementBg;
                circleColor = theme.colors.primaryTextColor;
                // could show numeric label or something like a spinner icon, etc.
              } else if (isNotStarted) {
                circleBg = "gray.200";
                circleColor = "gray.600";
              }

              const distanceFromCurrent = Math.abs(index - currentPage);
              let scaleValue = 0.85;
              if (distanceFromCurrent === 1) {
                scaleValue = 0.75;
              } else if (distanceFromCurrent > 1) {
                scaleValue = 0.65;
              }

              return (
                <Flex
                  key={index}
                  direction="column"
                  align="center"
                  justify="flex-start"
                  flexShrink={0}
                  w={`${itemSize}px`}
                  transform={`scale(${scaleValue})`}
                  transition={"transform 0.5s ease-out"}
                >
                  <Circle
                    size={"28px"}
                    bg={circleBg}
                    color={circleColor}
                    fontWeight="bold"
                    cursor="pointer"
                    onClick={() => jumpToPage(page)}
                    border={
                      isCurrent
                        ? `2px solid ${theme.colors.secondaryTextColor}`
                        : isCompleted
                          ? "2px solid transparent"
                          : "none"
                    }
                    boxShadow={
                      isCurrent ? `0 0 0 2px ${theme.colors.primary}` : "none"
                    }
                    transition="background-color 0.2s"
                  >
                    {circleContent}
                  </Circle>
                  <Box
                    fontSize={"xs"}
                    mt={1}
                    textAlign="center"
                    whiteSpace="normal"
                    wordBreak="normal"
                    lineHeight="short"
                  >
                    <Text color={theme.colors.primaryTextColor}>{title}</Text>
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
          size={["xs", "sm"]}
        />
        <IconButton
          aria-label="Last page"
          icon={<LastPage />}
          onClick={handleLast}
          isDisabled={isLastPage}
          size={["xs", "sm"]}
        />

        <Flex
          // Position absolutely at the bottom center of this container
          position="absolute"
          bottom="4px"
          left="50%"
          transform="translateX(-50%)"
          align="center"
          gap="4px" // space between small circles
        >
          {pages.map((_, i) => {
            const isCompleted = i < maxPage;
            const isCurrent = i === currentPage;
            const isNotStarted = i > maxPage;

            let miniCircleBg = "gray.400";

            if (isCompleted) {
              miniCircleBg = theme.colors.seduloGreen;
            } else if (isNotStarted) {
              miniCircleBg = "gray.300";
            }

            // If it's current, let's make it more obvious
            let miniCircleSize = "6px";
            let miniCircleBorder = "none";

            if (isCurrent) {
              miniCircleBg = theme.colors.primary; // or any highlight color
              miniCircleSize = "10px"; // bigger circle
              miniCircleBorder = `2px solid ${theme.colors.seduloGreen}`;
            }

            return (
              <Box
                key={i}
                as="span"
                w={miniCircleSize}
                h={miniCircleSize}
                borderRadius="50%"
                bg={miniCircleBg}
                border={miniCircleBorder}
              />
            );
          })}
        </Flex>
      </Flex>
    </Box>
  );
};

export default TopNavigation;
