"use client";

import {
  Box,
  Divider,
  Text,
  useBreakpointValue,
  useTheme,
  VStack,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import SideBarMenuItem from "./SideBarMenuItem";
import { BlurOn, ChevronLeft, ChevronRight, Close } from "@mui/icons-material";

export interface MenuItem {
  label: string;
  icon: JSX.Element;
  onClick: () => void;
  category?: string;
}

interface RightHandNavigationDrawerProps {
  title?: string;
  defaultDrawerState?: "closed" | "half-open" | "fully-open";
  menuItems?: MenuItem[];
}

export function RightHandNavigationDrawer({
  menuItems,
  title,
  defaultDrawerState = "closed",
}: RightHandNavigationDrawerProps) {
  const [drawerState, setDrawerState] = useState<
    "closed" | "half-open" | "fully-open"
  >(defaultDrawerState);
  const theme = useTheme();

  const iconFontSize = useBreakpointValue({ base: "1.3rem", lg: "1.5rem" });

  const MotionBox = motion(Box);

  const toggleDrawer = () => {
    if (drawerState === "fully-open") {
      setDrawerState("half-open");
    } else {
      setDrawerState("fully-open");
    }
  };

  return (
    <>
      {drawerState === "closed" && (
        <Box
          position="absolute"
          top={[74, 74, 78]}
          right={[4, 4, 5]}
          zIndex={1}
          display={"flex"}
          alignItems="center"
          justifyContent="center"
          color={"rgba(248,248,248,0.8)"}
          borderRadius="full"
          aspectRatio={1}
          w={["30px", "30px", "36px"]}
          h={["30px", "30px", "36px"]}
          backgroundColor={"rgba(255,255,255,0.2)"}
          border="1px solid white"
          p={1}
          transform="scale(1)" // Initial scale
          transition="transform 0.2s ease-in-out" // Smooth scaling effect
          _hover={{ transform: "scale(1.2)" }} // Scale up on hover
        >
          <BlurOn
            onClick={toggleDrawer}
            cursor="pointer"
            style={{ fontSize: iconFontSize }}
          />
        </Box>
      )}

      <AnimatePresence>
        {drawerState !== "closed" && (
          <MotionBox
            display={"block"}
            position="fixed"
            top={0}
            right={0}
            bottom={0}
            width={drawerState === "fully-open" ? 225 : 61}
            zIndex={5}
            bg="white"
            boxShadow="xl"
            gap={0}
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <VStack align="stretch" height="100%" pt={"60px"} gap={0}>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent={"flex-end"}
                gap={2}
                pr={2}
                position={"absolute"}
                right={0}
                zIndex={2}
                background={"white"}
                w={"full"}
              >
                {drawerState === "fully-open" && (
                  <Box
                    color={theme.colors.perygonPink}
                    onClick={toggleDrawer}
                    m={0}
                    p={0}
                    zIndex={1}
                  >
                    <ChevronRight
                      style={{
                        fontSize: "1.4rem",
                        cursor: "pointer",
                      }}
                    />
                  </Box>
                )}
                {drawerState === "half-open" && (
                  <Box
                    color={theme.colors.perygonPink}
                    onClick={toggleDrawer}
                    m={0}
                    p={0}
                    zIndex={1}
                  >
                    <ChevronLeft
                      style={{
                        fontSize: "1.4rem",
                        cursor: "pointer",
                      }}
                    />
                  </Box>
                )}

                {drawerState === "fully-open" && (
                  <Box
                    color={theme.colors.perygonPink}
                    onClick={() => setDrawerState("closed")}
                    m={0}
                    p={0}
                    zIndex={1}
                  >
                    <Close
                      style={{
                        fontSize: "1.4rem",
                        cursor: "pointer", // Apply cursor style directly to the icon
                      }}
                    />
                  </Box>
                )}
              </Box>
              {drawerState === "fully-open" && (
                <Box px={4}>
                  <h2 style={{ color: theme.colors.perygonPink }}>{title}</h2>
                </Box>
              )}
              <Box
                flex={1}
                position="relative"
                zIndex={1}
                p={4}
                pt={7}
                overflowY="auto"
              >
                <VStack spacing={0} align="stretch" width="100%">
                  {menuItems &&
                    menuItems.length > 0 &&
                    menuItems.map((item, index) => (
                      <React.Fragment key={item.label}>
                        <SideBarMenuItem
                          label={item.label}
                          icon={item.icon}
                          onClick={item.onClick}
                          showIconOnly={drawerState !== "fully-open"}
                          iconSize={6}
                          hoverStyles={{
                            border: `1px solid ${theme.colors.perygonPink}`,
                            color: theme.colors.perygonPink,
                          }}
                        />
                        {index < menuItems.length - 1 && (
                          <Divider
                            borderColor={theme.colors.perygonPink}
                            opacity={0.2}
                            my={2}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  {!menuItems && drawerState === "fully-open" && (
                    <Text>No menu items supplied</Text>
                  )}
                </VStack>
              </Box>
            </VStack>
          </MotionBox>
        )}
      </AnimatePresence>
    </>
  );
}
