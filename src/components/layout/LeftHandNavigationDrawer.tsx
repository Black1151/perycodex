"use client";

import { Box, Divider, Text, useTheme, VStack } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import SideBarMenuItem from "./SideBarMenuItem";
import { ChevronLeft, ChevronRight, Close, Menu } from "@mui/icons-material";

export interface MenuItem {
  label: string;
  icon: JSX.Element;
  onClick: () => void;
  category?: string;
}

interface LeftHandNavigationDrawerProps {
  title?: string;
  defaultDrawerState?: "closed" | "half-open" | "fully-open";
  menuItems?: MenuItem[];
}

export function LeftHandNavigationDrawer({
  menuItems,
  title,
  defaultDrawerState = "closed",
}: LeftHandNavigationDrawerProps) {
  const [drawerState, setDrawerState] = useState<
    "closed" | "half-open" | "fully-open"
  >(defaultDrawerState);
  const theme = useTheme();

  const MotionBox = motion(Box);

  const toggleDrawer = () => {
    if (drawerState === "fully-open") {
      setDrawerState("half-open");
    } else {
      setDrawerState("fully-open");
    }
  };

  const groupedItems =
    menuItems?.reduce(
      (acc, item) => {
        const category = item.category || "uncategorized";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(item);
        return acc;
      },
      {} as Record<string, MenuItem[]>,
    ) || {};

  return (
    <>
      {drawerState === "closed" && (
        <Box
          position="absolute"
          top={78}
          left={5}
          zIndex={1}
          display={["none", "none", "flex"]} // Use "flex" instead of "block" for alignment
          alignItems="center" // Center content vertically
          justifyContent="center" // Center content horizontally
          color={"rgba(248,248,248,0.8)"}
          borderRadius="full"
          aspectRatio={1}
          w="36px"
          h="36px"
          backgroundColor={"rgba(255,255,255,0.2)"}
          border="1px solid white"
          p={1}
          transform="scale(1)" // Initial scale
          transition="transform 0.2s ease-in-out" // Smooth scaling effect
          _hover={{ transform: "scale(1.2)" }} // Scale up on hover
        >
          <Menu
            onClick={toggleDrawer}
            cursor="pointer"
            style={{ fontSize: "1.5rem" }}
          />
        </Box>
      )}

      <AnimatePresence>
        {drawerState !== "closed" && (
          <MotionBox
            display={["none", "none", "block"]}
            position="fixed"
            top={0}
            left={0}
            bottom={0}
            width={drawerState === "fully-open" ? 225 : 61}
            zIndex={5}
            bg="white"
            boxShadow="xl"
            gap={0}
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <VStack align="stretch" height="100%" pt={"60px"} gap={0}>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent={"flex-end"}
                gap={2}
                mr={3}
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
                    <ChevronLeft
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
                    <ChevronRight
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
                py={4}
                px={2}
                pt={7}
                overflowY="auto"
              >
                <VStack spacing={0} align="stretch" width="100%">
                  {Object.entries(groupedItems).map(
                    ([category, itemsInCategory], categoryIndex) => (
                      <React.Fragment key={categoryIndex}>
                        {category !== "uncategorized" &&
                          drawerState === "fully-open" && (
                            <Box borderRadius="md" mb={4}>
                              <Text
                                fontWeight="bold"
                                fontSize="lg"
                                color={theme.colors.gray[600]}
                                mb={2}
                              >
                                {category}
                              </Text>

                              <Divider
                                borderColor={theme.colors.perygonPink}
                                opacity={0.5}
                              />
                            </Box>
                          )}
                        {itemsInCategory.map((item, index) => (
                          <React.Fragment key={item.label}>
                            <SideBarMenuItem
                              label={item.label}
                              icon={item.icon}
                              onClick={item.onClick}
                              showIconOnly={drawerState !== "fully-open"}
                              iconSize={6}
                              isLeft={true}
                              hoverStyles={{
                                background: `linear-gradient(45deg, ${theme.colors.perygonPink}, ${theme.colors.seduloRed})`,
                                color: "white",
                              }}
                            />
                            {index < itemsInCategory.length - 1 && (
                              <Divider
                                borderColor={theme.colors.perygonPink}
                                opacity={0.2}
                                my={2}
                              />
                            )}
                          </React.Fragment>
                        ))}
                        {categoryIndex <
                          Object.keys(groupedItems).length - 1 && (
                          <Divider
                            borderColor={theme.colors.perygonPink}
                            opacity={0.8}
                            my={6}
                          />
                        )}
                      </React.Fragment>
                    ),
                  )}
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
