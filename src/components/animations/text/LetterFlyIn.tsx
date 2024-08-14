"use-client";

import { Text, Box, BoxProps } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FC, ReactNode } from "react";

const MotionBox = motion(Box);

interface LetterFlyInProps extends BoxProps {
  children: ReactNode;
  delay?: number;
}

export const LetterFlyIn: FC<LetterFlyInProps> = ({
  children,
  delay = 0,
  ...rest
}) => {
  const text = children as string;
  const letters = text.split("");

  return (
    <Text
      display="inline-block"
      color="white"
      fontFamily="bonfire"
      whiteSpace="nowrap"
      fontSize={81}
      lineHeight={1}
      {...rest}
    >
      {letters.map((letter, index) => (
        <MotionBox
          key={index}
          display="inline-block"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.1,
            delay: index * 0.1 + delay,
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </MotionBox>
      ))}
    </Text>
  );
};
