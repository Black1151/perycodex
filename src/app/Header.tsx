"use client";

import { HStack, Box, Image } from "@chakra-ui/react";
import { Menu } from "@mui/icons-material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionHStack = motion(HStack);

export const Header = () => {
  return (
    <HStack
      gap={[5, 20]}
      px={5}
      width="100%"
      fontSize={[20, 40]}
      justifyContent="space-between"
      alignItems="center"
      pt={5}
    >
      <MotionBox
        initial={{ x: "-5vw", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        w="150px"
      >
        <Image
          src="/logoWhole.png"
          alt="profile pic"
          width="100%"
          height="100%"
          objectFit="cover"
        />
      </MotionBox>
      <MotionHStack
        initial={{ x: "5vw", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Box borderRadius="50%" overflow="hidden" width="40px" height="40px">
          <Image
            src="/profile.webp"
            alt="profile pic"
            width="100%"
            height="100%"
            objectFit="cover"
          />
        </Box>
        <Menu style={{ color: "white" }} />
      </MotionHStack>
    </HStack>
  );
};
