"use client";

import LoadingBar from "@/components/LoadingBar/LoadingBar";
import { Box, Center, Flex, Image, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { keyframes } from "@emotion/react";

// // === Keyframes ===
// const swirlIn = keyframes`
//   0% {
//     transform: scale(0) rotate(0deg);
//     opacity: 0;
//   }
//   100% {
//     transform: scale(1) rotate(720deg);
//     opacity: 1;
//   }
// `;

// const gaugePop = keyframes`
//   0% {
//     transform: scale(0);
//     opacity: 0;
//   }
//   70% {
//     transform: scale(1.15);
//     opacity: 1;
//   }
//   100% {
//     transform: scale(1);
//     opacity: 1;
//   }
// `;

// === Component ===
export const BusinessScoreSplashScreen = () => {
  const MotionVStack = motion(VStack);
  const MotionImage = motion(Image);

  return (
    <Center flex={1}>
      <MotionVStack
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0, scale: 0.75 }}
        transition={{ delay: 3.5, duration: 1, ease: "easeInOut" }}
        position="relative"
      >
        {/* Background text */}
        <Box
          bgImage="url('/assets/splash-screens/business-score/business-score-logo-text.png')"
          bgSize="contain"
          bgRepeat="no-repeat"
          bgPosition="center"
          minW={["300px", "400px"]}
          h={["120px", "160px"]}
          //   animation={`${swirlIn} 1.2s ease-in-out`}
        >
          {/* Dial */}
          <Flex
            position="relative"
            left="50%"
            top={"40%"}
            transform="translateX(-50%)"
            // top={["4px", "8px"]}
            w={["70px", "105px"]}
            h={["70px", "105px"]}
          >
            {/* Base */}
            <Image
              src="/assets/splash-screens/business-score/base.png"
              position="absolute"
              w="100%"
              top={0}
              left={0}
            />

            {/* Coloured gauge */}
            <MotionImage
              src="/assets/splash-screens/business-score/gauge.png"
              position="absolute"
              w="100%"
              top={0}
              left={0}
              //   animation={`${gaugePop} 0.8s ease-out 0.3s`}
            />

            {/* Rotating needle */}
            <MotionImage
              src="/assets/splash-screens/business-score/needle.png"
              position="absolute"
              w="100%"
              top={0}
              left={0}
              initial={{ rotate: -120 }}
              animate={{ rotate: [-120, 30, 0] }}
              transition={{
                delay: 1.2,
                duration: 2.5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 0.5,
              }}
            />

            {/* Centre disc */}
            <MotionImage
              src="/assets/splash-screens/business-score/centre.png"
              position="absolute"
              w={["50px", "70px"]}
              top="50%"
              left="50%"
              style={{ x: "-50%", y: "-50%" }}
              //   animation={`${gaugePop} 0.6s ease-out 0.5s`}
            />
          </Flex>
        </Box>

        {/* Progress bar beneath logo */}
        <LoadingBar />
      </MotionVStack>
    </Center>
  );
};
