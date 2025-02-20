"use client";

import React from 'react';
import {Box, VStack, HStack, useTheme} from "@chakra-ui/react";
import {ChevronLeft, ChevronRight, Close, Menu} from "@mui/icons-material";
import {AnimatePresence, motion} from "framer-motion";
import useDrawerState, {DrawerStateOptions} from "@/components/Sidebar/useDrawerState";


interface SidebarProps {
    initialState: DrawerStateOptions;
    halfOpenContent: React.ReactNode;
    fullyOpenContent: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({
                                             initialState = "closed",
                                             halfOpenContent,
                                             fullyOpenContent
                                         }) => {
        const theme = useTheme();
        const {drawerState, openDrawer, closeDrawer, toggleDrawer} = useDrawerState({initialState})

        if (drawerState === "closed") {
            return (
                <Box
                    position="absolute"
                    top={78}
                    left={5}
                    zIndex={1}
                    display={["none", "none", "flex"]}
                    alignItems="center"
                    justifyContent="center"
                    color={"rgba(248,248,248,0.8)"}
                    borderRadius="full"
                    aspectRatio={1}
                    w="36px"
                    h="36px"
                    backgroundColor={"rgba(255,255,255,0.2)"}
                    border="1px solid white"
                    p={1}
                    transform="scale(1)"
                    transition="transform 0.2s ease-in-out"
                    _hover={{transform: "scale(1.2)"}}
                >
                    <Menu
                        onClick={openDrawer}
                        cursor="pointer"
                        style={{fontSize: "1.5rem"}}
                    />
                </Box>
            )
        }

        const MotionBox = motion(Box);

        return (
            <AnimatePresence>
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
                    initial={{x: "-100%", opacity: 0}}
                    animate={{x: 0, opacity: 1}}
                    exit={{x: "-100%", opacity: 0}}
                    transition={{type: "spring", stiffness: 300, damping: 30}}
                >
                    <Box height="100%" pt={"60px"} px={2}>
                        <HStack alignItems="center" justify={'flex-end'}>
                            {drawerState === "fully-open" && (
                                <>
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
                                    <Box
                                        color={theme.colors.perygonPink}
                                        onClick={closeDrawer}
                                        m={0}
                                        p={0}
                                        zIndex={1}
                                    >
                                        <Close
                                            style={{
                                                fontSize: "1.4rem",
                                                cursor: "pointer",
                                            }}
                                        />
                                    </Box>
                                </>
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
                        </HStack>
                        {drawerState === "half-open" && halfOpenContent}
                        {drawerState === "fully-open" && fullyOpenContent}
                    </Box>
                </MotionBox>
            </AnimatePresence>
        )
    }
;
export default Sidebar;