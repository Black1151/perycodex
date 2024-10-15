import { Box, VStack, useTheme, IconButton, Divider } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import React from "react";
import { RotatingChevron } from "./RotatingChevron";
import SideBarMenuItem from "./SideBarMenuItem";
import { Build, Person, Business, Lock } from "@mui/icons-material";
import { LetterFlyIn } from "../animations/text/LetterFlyIn";

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

  // Updated toggleDrawer logic
  const toggleDrawer = () => {
    if (drawerState === "closed") {
      setDrawerState("fully-open");
    } else if (drawerState === "fully-open") {
      setDrawerState("half-open");
    } else {
      setDrawerState("closed");
    }
  };

  const menuItems = [
    {
      label: "My Tools",
      icon: <Build sx={{ width: "100%", height: "100%" }} />,
      onClick: () => console.log("My Tools clicked"),
    },
    {
      label: "My Profile",
      icon: <Person sx={{ width: "100%", height: "100%" }} />,
      onClick: () => console.log("Profile clicked"),
    },
    {
      label: "My Company",
      icon: <Business sx={{ width: "100%", height: "100%" }} />,
      onClick: () => console.log("My Company clicked"),
    },
    {
      label: "Change Password",
      icon: <Lock sx={{ width: "100%", height: "100%" }} />,
      onClick: () => console.log("Change Password clicked"),
    },
  ];

  return (
    <>
      {/* RotatingChevron now takes the drawerState */}
      <RotatingChevron
        placement={placement}
        onClick={toggleDrawer}
        drawerState={drawerState}
      />

      <AnimatePresence>
        {drawerState !== "closed" && (
          <MotionBox
            position="fixed"
            top={0}
            left={placement === "left" ? 0 : "auto"}
            right={placement === "right" ? 0 : "auto"}
            bottom={0}
            width={drawerState === "fully-open" ? 225 : 75} // Full width for fully-open
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
            <VStack align="stretch" height="100%" mt={20}>
              {drawerState === "fully-open" && (
                <Box px={4}>
                  <LetterFlyIn
                    duration={0.03}
                    fontSize={26}
                    color={theme.colors.perygonPink}
                  >
                    {drawerHeader}
                  </LetterFlyIn>
                </Box>
              )}

              <Box
                flex={1}
                position="relative"
                zIndex={1}
                p={4}
                overflowY="auto"
              >
                {drawerState === "fully-open" ? (
                  <VStack spacing={0} align="stretch" width="100%">
                    {menuItems.map((item, index) => (
                      <React.Fragment key={item.label}>
                        <SideBarMenuItem
                          label={item.label}
                          icon={item.icon}
                          onClick={item.onClick}
                          showIconOnly={false}
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
                  </VStack>
                ) : (
                  <VStack spacing={0} align="stretch" width="100%">
                    {menuItems.map((item, index) => (
                      <React.Fragment key={item.label}>
                        <SideBarMenuItem
                          label={item.label}
                          icon={item.icon}
                          onClick={item.onClick}
                          showIconOnly={true}
                          iconSize="50px"
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
                  </VStack>
                )}
              </Box>
            </VStack>

            <IconButton
              aria-label="Toggle Drawer"
              icon={
                placement === "left" ? (
                  drawerState === "fully-open" ? (
                    <ChevronLeft />
                  ) : drawerState === "half-open" ? (
                    <ChevronLeft />
                  ) : (
                    <ChevronRight />
                  )
                ) : drawerState === "fully-open" ? (
                  <ChevronRight />
                ) : drawerState === "half-open" ? (
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
