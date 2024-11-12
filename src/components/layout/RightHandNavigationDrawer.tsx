"use client";
import { useState } from "react";
import { Box, VStack, useTheme, Divider, Text } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { RotatingChevron } from "./RotatingChevron";
import SideBarMenuItem from "./SideBarMenuItem";

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

  const MotionBox = motion(Box);

  const toggleDrawer = () => {
    if (drawerState === "closed") {
      setDrawerState("fully-open");
    } else if (drawerState === "fully-open") {
      setDrawerState("half-open");
    } else {
      setDrawerState("closed");
    }
  };

  // Touch event state
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [touchEndY, setTouchEndY] = useState<number | null>(null);
  const [touchId, setTouchId] = useState<number | null>(null);

  const minSwipeDistance = 50; // Adjust as needed

  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.targetTouches[0];
    setTouchId(touch.identifier);
    setTouchEndX(null);
    setTouchEndY(null);
    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchId === null) return;
    const touch = Array.from(e.changedTouches).find(
      (t) => t.identifier === touchId,
    );
    if (!touch) return;
    setTouchEndX(touch.clientX);
    setTouchEndY(touch.clientY);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchId === null) return;
    const touch = Array.from(e.changedTouches).find(
      (t) => t.identifier === touchId,
    );
    if (!touch || touchStartX === null || touchStartY === null) return;

    const deltaX = touchStartX - touch.clientX;
    const deltaY = touchStartY - touch.clientY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    setTouchId(null);

    if (absDeltaX < minSwipeDistance || absDeltaX < absDeltaY) {
      return;
    }

    if (deltaX > 0) {
      if (drawerState === "closed") {
        setDrawerState("fully-open");
      } else if (drawerState === "half-open") {
        setDrawerState("fully-open");
      }
    } else {
      if (drawerState !== "closed") {
        setDrawerState("closed");
      }
    }
  };

  return (
    <>
      <Box position="absolute" top={59} right={16} zIndex={1}>
        <RotatingChevron
          placement="right"
          onClick={toggleDrawer}
          drawerState={drawerState}
        />
      </Box>

      {/* Touch area when drawer is closed */}
      {drawerState === "closed" && (
        <Box
          position="fixed"
          top={0}
          right={0}
          bottom={0}
          width="20px"
          zIndex={5}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        />
      )}

      <AnimatePresence>
        {drawerState !== "closed" && (
          <MotionBox
            position="fixed"
            top={-6}
            right={0}
            bottom={0}
            width={drawerState === "fully-open" ? 225 : 61}
            zIndex={5}
            bg="white"
            boxShadow="xl"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <VStack align="stretch" height="100%" mt={20}>
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

            <Box
              position="absolute"
              top={69}
              left={drawerState === "fully-open" ? -18 : -21}
            >
              <RotatingChevron
                size={drawerState === "fully-open" ? "2rem" : "1.5rem"}
                placement="left"
                onClick={toggleDrawer}
                drawerState={drawerState}
                color={theme.colors.perygonPink}
              />
            </Box>

            {/* Touch area to detect swipe to close */}
            <Box
              position="absolute"
              top={0}
              left={0}
              bottom={0}
              width="20px"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            />
          </MotionBox>
        )}
      </AnimatePresence>
    </>
  );
}
