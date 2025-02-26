"use client";

import LoadingBar from "@/components/LoadingBar/LoadingBar";
import { Box, Center, Flex, Image, keyframes, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

const fadeIn = keyframes`
    0% {
        opacity: 0;
        transform: rotate(0deg);
    }
    100% {
        opacity: 1;
        transform: rotate(360deg);
    }
`;

const spinOvershoot = keyframes`
    0% {
        transform: rotate(0deg) scale(1);
    }
    50% {
        transform: rotate(900deg) scale(1);
    }
    70% {
        transform: rotate(850deg) scale(1);
    }
    90% {
        transform: rotate(870deg) scale(1.1);
    }
    100% {
        transform: rotate(860deg) scale(1);
    }
`;

export const EnpsSplashScreen = () => {
  const MotionVStack = motion(VStack);
  return (
    <Center flex={1}>
      <MotionVStack
        initial={{ opacity: 1, rotate: 0 }}
        animate={{ opacity: 0, rotate: -1080 }}
        transition={{ delay: 3.5, duration: 1, ease: "easeInOut" }}
      >
        <Box
          bgImage="url('/assets/splash-screens/eNPS/logo-eNPS-main-splash.gif')"
          bgSize="contain"
          bgRepeat="no-repeat"
          bgPosition="center"
          w="300px"
          h="100px"
          animation={`${fadeIn} 1s ease-in-out`}
        >
          <Flex
            position="relative"
            left="145px"
            top="-10px"
            animation={`${fadeIn} 1.2s ease-in-out`}
            transformOrigin="center"
          >
            <Box animation={`${spinOvershoot} 1.5s ease-in-out 2.5s`}>
              <Image src="/assets/splash-screens/enps/eNPS-icon.png" w="48px" />
            </Box>
          </Flex>
        </Box>
        <LoadingBar />
      </MotionVStack>
    </Center>
  );
};
