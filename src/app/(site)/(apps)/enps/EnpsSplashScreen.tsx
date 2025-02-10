"use client";

import LoadingBar from "@/components/LoadingBar/LoadingBar";
import {Box, Center, keyframes, VStack} from "@chakra-ui/react";

import {motion} from "framer-motion";

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

export const EnpsSplashScreen = () => {
    const MotionVStack = motion(VStack);
    return (
        <Center flex={1}>
            <MotionVStack
                initial={{opacity: 1, rotate: 0}}
                animate={{opacity: 0, rotate: -1080}}
                transition={{delay: 3.5, duration: 1, ease: "easeInOut"}}
            >
                <Box
                    bgImage="url('/assets/splash-screens/enps-score/enpsLogo.png')"
                    bgSize="contain"
                    bgRepeat="no-repeat"
                    bgPosition="center"
                    w="300px"
                    h="100px"
                    animation={`${fadeIn} 1s ease-in-out`}
                >
                </Box>
                <LoadingBar/>
            </MotionVStack>
        </Center>
    );
};
