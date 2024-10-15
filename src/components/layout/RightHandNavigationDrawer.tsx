import { Box, VStack, useTheme, IconButton, Divider } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import React from "react";
import { RotatingChevron } from "./RotatingChevron";
import SideBarMenuItem from "./SideBarMenuItem";
import {
  Build,
  Person,
  Business,
  Lock,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";

export function RightHandNavigationDrawer() {
  const [drawerState, setDrawerState] = useState<
    "closed" | "half-open" | "fully-open"
  >("closed");
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
      icon: <Business sx={{ flex: 1, width: "100%", height: "100%" }} />,
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
      <Box position="absolute" top={59} right={16} zIndex={1}>
        <RotatingChevron
          placement="right"
          onClick={toggleDrawer}
          drawerState={drawerState}
        />
      </Box>

      <AnimatePresence>
        {drawerState !== "closed" && (
          <MotionBox
            position="fixed"
            top={-6}
            right={0}
            bottom={0}
            width={drawerState === "fully-open" ? 225 : 75}
            zIndex={5}
            bg="white"
            boxShadow="xl"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <VStack align="stretch" height="100%" mt={20}>
              <Box
                flex={1}
                position="relative"
                zIndex={1}
                p={4}
                overflowY="auto"
              >
                <VStack spacing={0} align="stretch" width="100%">
                  {menuItems.map((item, index) => (
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
                </VStack>
              </Box>
            </VStack>

            <Box
              position="absolute"
              bottom={55}
              right={drawerState === "fully-open" ? 220 : 20}
            >
              <RotatingChevron
                placement="left"
                onClick={toggleDrawer}
                drawerState={drawerState}
                color={theme.colors.perygonPink}
              />
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>
    </>
  );
}
