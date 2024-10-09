import { Box, VStack, useTheme, HStack, IconButton } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";
import ShapeAnimation from "./ShapeAnimation";
import React from "react";
import { RotatingChevron } from "./RotatingChevron";
import SideBarMenuItem from "./SideBarMenuItem";
import { Build, Person, Business, Lock } from "@mui/icons-material";

interface NavigationDrawerProps {
  drawerHeader: string;
  placement: "left" | "right";
}

export function NavigationDrawer({
  drawerHeader,
  placement,
}: NavigationDrawerProps) {
  const [drawerState, setDrawerState] = useState<
    "closed" | "half-open" | "fully-open"
  >("closed");
  const theme = useTheme();

  const MotionBox = motion(Box);

  const toggleDrawer = () => {
    if (drawerState === "closed") setDrawerState("half-open");
    else if (drawerState === "half-open") setDrawerState("fully-open");
    else setDrawerState("closed");
  };

  const menuItems = [
    {
      label: "My Tools",
      icon: (
        <Build
          sx={{ display: "flex", flex: 1, width: "100%", height: "100%" }}
        />
      ),
      onClick: () => console.log("My Tools clicked"),
    },
    {
      label: "My Profile",
      icon: (
        <Person
          sx={{ display: "flex", flex: 1, width: "100%", height: "100%" }}
        />
      ),
      onClick: () => console.log("Profile clicked"),
    },
    {
      label: "My Company",
      icon: (
        <Business
          sx={{ display: "flex", flex: 1, width: "100%", height: "100%" }}
        />
      ),
      onClick: () => console.log("My Company clicked"),
    },
    {
      label: "Change Password",
      icon: (
        <Lock
          sx={{ display: "flex", flex: 1, width: "100%", height: "100%" }}
        />
      ),
      onClick: () => console.log("Change Password clicked"),
    },
  ];

  return (
    <>
      <RotatingChevron placement={placement} onClick={toggleDrawer} />

      <AnimatePresence>
        {drawerState !== "closed" && (
          <MotionBox
            position="fixed"
            top={0}
            left={placement === "left" ? 0 : "auto"}
            right={placement === "right" ? 0 : "auto"}
            bottom={0}
            width={drawerState === "fully-open" ? 300 : 75}
            zIndex={5}
            bg="white"
            boxShadow="xl"
            initial={{
              x: placement === "left" ? "-100%" : "100%",
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x: placement === "left" ? "-100%" : "100%",
              opacity: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            <VStack spacing={4} align="stretch" height="100%" mt={20}>
              {drawerState === "fully-open" && (
                <Box p={4}>
                  <LetterFlyIn
                    duration={0.03}
                    fontSize={30}
                    color={theme.colors.perygonPink}
                  >
                    {drawerHeader}
                  </LetterFlyIn>
                </Box>
              )}

              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                zIndex={0}
                overflow="hidden"
              >
                <ShapeAnimation />
              </Box>
              <Box
                flex={1}
                position="relative"
                zIndex={1}
                p={4}
                overflowY="auto"
              >
                {drawerState === "fully-open" ? (
                  menuItems.map((item) => (
                    <SideBarMenuItem
                      key={item.label}
                      label={item.label}
                      icon={item.icon}
                      onClick={item.onClick}
                      showIconOnly={false}
                    />
                  ))
                ) : (
                  <VStack spacing={4}>
                    {menuItems.map((item) => (
                      <SideBarMenuItem
                        key={item.label}
                        label={item.label}
                        icon={item.icon}
                        onClick={item.onClick}
                        showIconOnly={true}
                        iconSize="50px"
                      />
                    ))}
                  </VStack>
                )}
              </Box>
            </VStack>
            <IconButton
              aria-label="Toggle Drawer"
              icon={
                placement === "left" ? (
                  drawerState === "half-open" ? (
                    <ChevronRight />
                  ) : drawerState === "fully-open" ? (
                    <ChevronLeft />
                  ) : (
                    <ChevronRight />
                  )
                ) : drawerState === "half-open" ? (
                  <ChevronLeft />
                ) : drawerState === "fully-open" ? (
                  <ChevronRight />
                ) : (
                  <ChevronLeft />
                )
              }
              position="absolute"
              bottom={30}
              right={placement === "left" ? 4 : "auto"}
              left={placement === "right" ? 4 : "auto"}
              onClick={toggleDrawer}
              zIndex={6}
              backgroundColor="perygonPink"
              color="white"
              _hover={{
                color: "perygonPink",
                border: "1px solid",
                borderColor: "perygonPink",
                backgroundColor: "white",
              }}
              transition="all 0.2s"
            />
          </MotionBox>
        )}
      </AnimatePresence>
    </>
  );
}
