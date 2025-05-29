"use client";

import React, { useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Button,
  Portal,
  ScaleFade,
  useColorModeValue,
  Icon as ChakraIcon,
  useBreakpointValue,
  useTheme,
} from "@chakra-ui/react";
import { Close } from "@mui/icons-material";
import { motion, Variants } from "framer-motion";
import { MenuItem } from "./NavigationSidebar/NavigationMobilePopoutMenu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    transition: { staggerChildren: 0.1, staggerDirection: 1 },
  },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.08,
      staggerDirection: -1,
    },
  },
};

const containerVariantsDown: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
    transition: { staggerChildren: 0.5, staggerDirection: 1 },
  },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
      staggerChildren: 0.12,
      staggerDirection: 1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const itemVariantsDown: Variants = {
  hidden: { opacity: 0, y: -12 },
  show: { opacity: 1, y: 0 },
};

const MotionFlex = motion(Flex);
const MotionBox = motion(Box);

export interface ContextualMenuProps {
  menuItems: MenuItem[];
}

const ContextualMenu: React.FC<ContextualMenuProps> = ({ menuItems }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const overlayBg = useColorModeValue("blackAlpha.700", "whiteAlpha.200");
  const isMobile = useBreakpointValue({ base: true, sm: true, md: false });

  const toggle = () => setIsExpanded((prev) => !prev);
  const close = () => setIsExpanded(false);
  const theme = useTheme();

  // The button + popout panel for **mobile**:
  const mobileMenu = (
    <>
      {isExpanded && (
        <Box
          position="fixed"
          inset={0}
          bg={overlayBg}
          zIndex={100}
          onClick={close}
          opacity={isExpanded ? 1 : 0}
          pointerEvents={isExpanded ? "auto" : "none"}
          transition="opacity 0.2s ease-in-out"
        />
      )}
      <MotionFlex
        position="fixed"
        left="12px"
        bottom="110px"
        zIndex={100}
        flexDirection="column-reverse"
        alignItems="flex-start"
      >
        <IconButton
          aria-label={isExpanded ? "Close menu" : "Open menu"}
          icon={
            isExpanded ? (
              <Close fontSize="medium" />
            ) : (
              <MoreHorizIcon fontSize="medium" />
            )
          }
          onClick={toggle}
          color={theme.colors.iconColor}
          bg="rgba(66, 66, 66, 0.6)"
          backdropFilter="blur(10px)"
          borderRadius="full"
          w="40px"
          h="40px"
          border={`1px solid ${theme.colors.iconColor}`}
          p={0}
          transform="scale(1)"
          transition="transform 0.2s ease-in-out"
          _hover={{ transform: "scale(1.05)", bg: "rgba(66, 66, 66, 0.75)" }}
        />

        <ScaleFade in={isExpanded} initialScale={0.95} unmountOnExit>
          <MotionFlex
            direction="column"
            mb={2}
            minW="240px"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            bg={"rgb(0,0,0,0)"}
          >
            {menuItems.map((item, idx) => (
              <MotionBox
                key={idx}
                variants={itemVariants}
                mb={idx < menuItems.length - 1 ? 3 : 0}
                bg={useColorModeValue("gray.50", "gray.700")}
                rounded="md"
                p={2}
                pl={0}
              >
                <Button
                  onClick={() => {
                    item.onClick();
                    close();
                  }}
                  leftIcon={<ChakraIcon as={item.icon.type} boxSize={8} />}
                  justifyContent="start"
                  w="100%"
                  minH="44px"
                  variant="ghost"
                  isDisabled={item.locked}
                  colorScheme={item.active ? "blue" : undefined}
                  pl={2}
                  fontSize="small"
                >
                  {item.label}
                </Button>
              </MotionBox>
            ))}
          </MotionFlex>
        </ScaleFade>
      </MotionFlex>
    </>
  );

  // The button + popout panel for **desktop**:
  const desktopMenu = (
    <>
      {isExpanded && (
        <Box
          position="fixed"
          inset={0}
          bg={overlayBg}
          zIndex={100}
          onClick={close}
          opacity={isExpanded ? 1 : 0}
          pointerEvents={isExpanded ? "auto" : "none"}
          transition="opacity 0.2s ease-in-out"
        />
      )}
      <Box position="relative" display="inline-block" zIndex={101}>
        <IconButton
          aria-label={isExpanded ? "Close menu" : "Open menu"}
          icon={
            isExpanded ? (
              <Close fontSize="medium" />
            ) : (
              <MoreHorizIcon fontSize="medium" />
            )
          }
          onClick={toggle}
          color={theme.colors.iconColor}
          bg="rgba(255,255,255,0.2)"
          backdropFilter="blur(10px)"
          borderRadius="full"
          w="40px"
          h="40px"
          border={`1px solid ${theme.colors.iconColor}`}
          p={0}
          transform="scale(1)"
          transition="transform 0.2s ease-in-out"
          _hover={{ transform: "scale(1.05)", bg: "rgba(255,255,255, 0.35)" }}
        />

        <ScaleFade in={isExpanded} initialScale={0.95} unmountOnExit>
          <MotionFlex
            position="absolute"
            top="calc(100% + 8px)"
            right={0}
            direction="column"
            minW="240px"
            boxShadow="md"
            rounded="md"
            p={2}
            variants={containerVariantsDown}
            initial="hidden"
            animate="show"
            bg={"rgb(0,0,0,0)"}
          >
            {menuItems.map((item, idx) => (
              <MotionBox
                key={idx}
                variants={itemVariantsDown}
                mb={idx < menuItems.length - 1 ? 3 : 0}
              >
                <Button
                  onClick={() => {
                    item.onClick();
                    close();
                  }}
                  leftIcon={<ChakraIcon as={item.icon.type} boxSize={8} />}
                  justifyContent="start"
                  w="100%"
                  minH="44px"
                  variant="ghost"
                  isDisabled={item.locked}
                  colorScheme={item.active ? "blue" : undefined}
                  fontSize="small"
                  pl={2}
                  bg={"white"}
                >
                  {item.label}
                </Button>
              </MotionBox>
            ))}
          </MotionFlex>
        </ScaleFade>
      </Box>
    </>
  );

  return isMobile ? <Portal>{mobileMenu}</Portal> : desktopMenu;
};

export default ContextualMenu;
