import React, { useRef, useEffect, useState } from "react";
import { Box, HStack, Text, useTheme, VStack } from "@chakra-ui/react";

interface SpeechBubbleSVGProps {
  fill?: string;
}

const SpeechBubbleSVG: React.FC<SpeechBubbleSVGProps> = ({ fill = "#fff" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 1600 1600"
    preserveAspectRatio="xMidYMid meet"
  >
    <path
      d="M1460.77,1163.87c65.27-117.74,97.75-251.52,93.93-386.89-5.47-193.84-85.16-376.45-224.42-514.2C1191.04,125.03,1007.56,47.3,813.65,43.88c-4.54-.08-9.13-.12-13.64-.12C387.16,43.76,48.48,379.55,45.03,792.3c-3.4,406.91,324.37,748.33,730.65,761.08,8.14.26,16.25.38,24.33.38,99.52,0,196.22-19.06,287.42-56.66,26.56-10.95,54.8-16.5,83.94-16.5,20.68,0,41.36,2.85,61.45,8.46l240.63,67.19-39.28-244.89c-7.98-49.76,1.47-102.14,26.6-147.48Z"
      fill={fill}
    />
  </svg>
);

interface SpeechBubbleProps {
  score: number;
  text: string;
  positiveChange?: boolean;
  fill?: string;
  textColor?: string;
  change: number;
}

const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  score,
  text,
  positiveChange,
  change,
  fill = "#fff",
  textColor,
}) => {
  const theme = useTheme();
  const defaultTextColor = theme.colors.perygonPink;
  const finalTextColor = textColor || defaultTextColor;

  const containerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(12);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        const newFontSize = Math.min(width / 2, height / 2);
        setFontSize(newFontSize);
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  const [wholePart, decimalPart] = score.toFixed(2).split(".");

  return (
    <Box position="relative" width="100%" height="100%">
      <SpeechBubbleSVG fill={fill} />
      <Box
        ref={containerRef}
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        textAlign="center"
        width="80%"
        height="80%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <HStack>
          <Text
            fontSize={`${fontSize}px`}
            fontWeight="bold"
            color={finalTextColor}
            lineHeight="1"
          >
            {wholePart}
          </Text>
          <VStack>
            <Text
              fontSize={`${fontSize * 0.4}px`}
              fontWeight="bold"
              color={finalTextColor}
              lineHeight="1"
              ml={1}
            >
              .{decimalPart}
            </Text>
            <Text
              fontSize={`${fontSize * 0.13}px`}
              color={positiveChange ? "seduloGreen" : "seduloRed"}
              mt={2}
            >
              {positiveChange ? "\u25B2" : "\u25BC"}
              {change.toFixed(2)}
            </Text>
          </VStack>
        </HStack>

        <Text
          fontSize={`${fontSize * 0.3}px`}
          fontWeight="bold"
          color={finalTextColor}
          mt={3}
          fontFamily="Bonfire"
        >
          {text}
        </Text>
      </Box>
    </Box>
  );
};

export default SpeechBubble;
