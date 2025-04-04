"use client";

import LoadingBar from "@/components/LoadingBar/LoadingBar";
import { Box, Center, Image, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { keyframes } from "@emotion/react";

const swirlIn = keyframes`
  0% {
    transform: translateX(100px) scale(0) rotate(0deg);
  }
  40% {
    transform: translateX(100px) scale(1.5) rotate(360deg);  
  }
  60% {
    transform: translateX(100px) scale(1.5) rotate(360deg);
  }
  75% {
    transform: translateX(200px);
  }
  90% {
    transform: translateX(0px);
  }
  95% {
    transform: scale(1.5) translateX(0) rotate(-10deg);
  }
  100% {
    transform: scale(1) translateX(0);
  }
`;

const backgroundWipe = keyframes`
  0% {
    clip-path: inset(0 0 0 100%);

  }
  70%{
    clip-path: inset(0 0 0 100%);

  }
  100% {
    clip-path: inset(0 0 0 0);
  }
`;

const fadeScaleOut = {
  opacity: 0,
  scale: 0.75,
};

export const ClientSatisfactionSplashScreen = () => {
  const MotionVStack = motion(VStack);

  return (
    <Center flex={1}>
      <MotionVStack
        initial={{ opacity: 1, scale: 1 }}
        animate={fadeScaleOut}
        transition={{ delay: 3.5, duration: 1, ease: "easeInOut" }}
      >
        <Box w="250px" h="100px" position="relative">
          <Box
            bgImage="url('/assets/splash-screens/client-satisfaction/client-satisfaction-logo-bg.png')"
            bgSize="contain"
            bgRepeat="no-repeat"
            bgPosition="center"
            w="250px"
            h="100px"
            animation={`${backgroundWipe} 2.5s ease-in-out forwards`}
          />

          <Box
            animation={`${swirlIn} ease-in-out 2.5s`}
            position="absolute"
            w="72px"
            top={2}
            left={-3}
          >
            <Image
              src="/assets/splash-screens/client-satisfaction/client-satisfaction-logo.png"
              w="100px"
            />
          </Box>
        </Box>
        <LoadingBar />
      </MotionVStack>
    </Center>
  );
};
