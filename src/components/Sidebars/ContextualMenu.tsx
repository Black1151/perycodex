import React, { useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Button,
  Portal,
  ScaleFade,
  Icon as ChakraIcon,
  useBreakpointValue,
  useTheme,
  Badge,
  VStack,
  Text,
} from "@chakra-ui/react";
import { Close } from "@mui/icons-material";
import { motion, Variants } from "framer-motion";
import { MenuItem } from "./NavigationSidebar/NavigationMobilePopoutMenu";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { ResponsiveValue } from "@chakra-ui/react";

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
  bottomOffset?: ResponsiveValue<string | number>;
}

const ContextualMenu: React.FC<ContextualMenuProps> = ({ menuItems, bottomOffset="110px" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const overlayBg = "blackAlpha.700";
  const isMobile = useBreakpointValue({ base: true, sm: true, md: false });

  const toggle = () => setIsExpanded((prev) => !prev);
  const close = () => setIsExpanded(false);
  const theme = useTheme();

  // Determine if any item needs action
  const hasActionNeeded = menuItems.some((item) => item.actionNeeded);

  const pulseAnimation = {
    boxShadow: [
      `0 0 16px 4px rgb(255,255,255,0.35)`,
      `0 0 32px 12px rgb(255,255,255,0.5)`,
      `0 0 16px 4px rgb(255,255,255,0.35)`,
    ],
  };
  const pulseTransition = {
    duration: 0.8,
    repeat: Infinity,
    ease: "easeInOut",
  };

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
          transition="all 0.2s ease-in-out"
          backdropFilter={isExpanded ? "blur(2px)" : "blur(0px)"}
        />
      )}
      <MotionFlex
        position="fixed"
        left="12px"
        bottom= {bottomOffset}
        zIndex={100}
        flexDirection="column-reverse"
        alignItems="flex-start"
      >
        {/* Wrapper for pulsing & indicator */}
        <MotionBox
          position="relative"
          animate={(hasActionNeeded && !isExpanded) ? pulseAnimation : {}}
          transition={(hasActionNeeded && !isExpanded) ? pulseTransition : {}}
          as="span"
          overflow={"visible"}
          rounded={"full"}
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
          {hasActionNeeded && (
            <Box
              position="absolute"
              top="1px"
              right="1px"
              w="12px"
              h="12px"
              bg="red.500"
              rounded="full"
            />
          )}
        </MotionBox>

        <ScaleFade in={isExpanded} initialScale={0.95} unmountOnExit>
          <MotionFlex
            direction="column"
            mb={2}
            minW="180px"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            bg="rgb(0,0,0,0)"
          >
            {menuItems.map((item, idx) => (
              <MotionBox
                key={idx}
                variants={itemVariants}
                initial="hidden"
                animate="show"
                mb={idx < menuItems.length - 1 ? 3 : 0}
                bg="gray.50"
                rounded="md"
                p={1}
                pl={0}
                position="relative"
                borderLeftWidth={item.actionNeeded ? "8px" : undefined}
                borderLeftColor={
                  item.actionNeeded ? theme.colors.primary : undefined
                }
              >
                {/* Pulsing glow layer */}
                {item.actionNeeded && (
                  <MotionBox
                    position="absolute"
                    inset={0}
                    rounded="md"
                    style={{ zIndex: -1 }}
                    animate={pulseAnimation}
                    transition={pulseTransition}
                  />
                )}

                <Button
                  onClick={() => {
                    if (!item.locked) {
                      item.onClick();
                      close();
                    }
                  }}
                  leftIcon={
                    <ChakraIcon
                      as={item.icon.type}
                      boxSize={6}
                      color={theme.colors.primary}
                    />
                  }
                  justifyContent="start"
                  w="100%"
                  h="auto"
                  variant="ghost"
                  isDisabled={item.locked}
                  pl={2}
                  py={2}
                  fontSize="15px"
                  bg="white"
                >
                  <VStack justifyContent="left" align="left" spacing={1}>
                    <Text>{item.label}</Text>
                    {item.actionNeeded && (
                        <Badge colorScheme="red" fontSize="0.7em">
                        {item.actionNeededText ?? "Action Needed"}
                        </Badge>
                    )}
                  </VStack>
                </Button>
                {item.locked && (
                  <Box position="absolute" top={2} right={2} zIndex={1}>
                    <ChakraIcon
                      as={require("@mui/icons-material/Lock").default}
                      boxSize={4}
                      color="gray.400"
                    />
                  </Box>
                )}
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
          transition="all 0.2s ease-in-out"
          backdropFilter={isExpanded ? "blur(2px)" : "blur(0px)"}
        />
      )}
      <Box position="relative" display="inline-block" zIndex={101} bg={"transparent"}>
        <MotionBox
          animate={(hasActionNeeded && !isExpanded) ? pulseAnimation : {}}
          transition={(hasActionNeeded && !isExpanded) ? pulseTransition : {}}
          as="span"
          rounded={"full"}
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
          {hasActionNeeded && (
            <Box
              position="absolute"
              top="1px"
              right="1px"
              w="12px"
              h="12px"
              bg="red.500"
              rounded="full"
            />
          )}
        </MotionBox>

        <ScaleFade in={isExpanded} initialScale={0.95} unmountOnExit>
          <MotionFlex
            position="absolute"
            top="calc(100% + 8px)"
            right={0}
            direction="column"
            minW="240px"
            rounded="md"
            p={2}
            variants={containerVariantsDown}
            initial="hidden"
            animate="show"
            bg="rgb(0,0,0,0)"
          >
            {menuItems.map((item, idx) => (
              <MotionBox
                key={idx}
                variants={itemVariantsDown}
                initial="hidden"
                animate="show"
                mb={idx < menuItems.length - 1 ? 3 : 0}
                position="relative"
                borderLeftWidth={item.actionNeeded ? "8px" : undefined}
                borderLeftColor={
                  item.actionNeeded ? theme.colors.primary : undefined
                }
                rounded="md"
              >
                {/* Pulsing glow layer */}
                {item.actionNeeded && (
                  <MotionBox
                    position="absolute"
                    inset={0}
                    rounded="md"
                    style={{ zIndex: -1 }}
                    animate={pulseAnimation}
                    transition={pulseTransition}
                  />
                )}

                <Button
                  onClick={() => {
                    if (!item.locked) {
                      item.onClick();
                      close();
                    }
                  }}
                  leftIcon={
                    <ChakraIcon
                      as={item.icon.type}
                      boxSize={8}
                      color={theme.colors.primary}
                    />
                  }
                  justifyContent="start"
                  w="100%"
                  h="auto"
                  variant="ghost"
                  fontSize="16px"
                  pl={2}
                  py={2}
                  bg="white"
                >
                  <VStack justifyContent="left" align="left" spacing={1}>
                    <Text>{item.label}</Text>
                    {item.actionNeeded && (
                      <Badge ml="auto" colorScheme="red" fontSize="0.75em">
                        {item.actionNeededText ?? "Action Needed"}
                      </Badge>
                    )}
                  </VStack>
                </Button>
                {item.locked && (
                  <Box position="absolute" top={2} right={2} zIndex={1}>
                    <ChakraIcon
                      as={require("@mui/icons-material/Lock").default}
                      boxSize={4}
                      color="gray.400"
                    />
                  </Box>
                )}
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
