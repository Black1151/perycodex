"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HStack, Box, chakra } from "@chakra-ui/react";

// Create a Chakra-wrapped motion.div so Chakra props (like theme colors) work
const MotionDiv = chakra(motion.div);

interface AnimatedTillNumberProps {
  /** The number to display/animate */
  value: number;
  /** How long (in seconds) the flick animation takes */
  duration?: number;
  /** Digit font size */
  fontSize?: string | number;
  /** Digit font weight */
  fontWeight?: string | number;
  /** Digit color (accepts Chakra theme token or CSS color) */
  color?: string;
  /** Digit text decoration */
  textDecoration?: string;
}

/**
 * Shows each digit in a fixed-size window and scrolls it
 * smoothly when `value` changes, without affecting
 * the overall layout height.
 */
export const AnimatedTillNumber: React.FC<AnimatedTillNumberProps> = ({
  value,
  duration = 0.8,
  fontSize = "2xl",
  fontWeight = "bold",
  color = "black",
  textDecoration = "none",
}) => {
  const prevValue = usePrevious(value) ?? value;
  const newStr = String(value);
  const oldStr = String(prevValue).padStart(newStr.length, "0");

  // Use duration in the spring transition
  const transition = { type: "spring", stiffness: 300, damping: 300, duration: 0.8 } as any;

  return (
    <HStack spacing={0} fontSize={fontSize} fontWeight={fontWeight} overflow="hidden">
      {newStr.split("").map((digit, idx) => {
        const prevDigit = oldStr[idx];
        const hasChanged = digit !== prevDigit;
        const directionUp = +digit > +prevDigit;

        return (
          <Box
            key={idx}
            position="relative"
            overflow="hidden"
            height="1em"
            width="0.65em"
            px="0.2em"
            textAlign="center"
          >
            <AnimatePresence initial={true} mode="sync">
              {/* old digit */}
              {hasChanged && (
                <MotionDiv
                  key={`old-${idx}-${prevValue}`}
                  position="absolute"
                  top={0}
                  left={0}
                  width="100%"
                  height="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color={color}
                  textDecoration={textDecoration}
                  initial={{ y: 0 }}
                  animate={{ y: directionUp ? "-100%" : "100%" }}
                  exit={{ y: directionUp ? "-100%" : "100%" }}
                  transition={transition}
                >
                  {prevDigit}
                </MotionDiv>
              )}

              {/* new digit */}
              <MotionDiv
                key={`new-${idx}-${value}`}
                position="absolute"
                top={0}
                left={0}
                width="100%"
                height="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                willChange="transform"
                color={color}
                textDecoration={textDecoration}
                initial={{ y: hasChanged ? (directionUp ? "100%" : "-100%") : 0 }}
                animate={{ y: 0 }}
                transition={transition}
              >
                {digit}
              </MotionDiv>
            </AnimatePresence>
          </Box>
        );
      })}
    </HStack>
  );
};

// simple hook to capture previous value
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export default AnimatedTillNumber;
