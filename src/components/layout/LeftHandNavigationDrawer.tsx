import {Box, VStack, useTheme, Divider, Text} from "@chakra-ui/react";
import {motion, AnimatePresence} from "framer-motion";
import {useState} from "react";
import React from "react";
import {RotatingChevron} from "./RotatingChevron";
import SideBarMenuItem from "./SideBarMenuItem";

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
                                             defaultDrawerState = 'closed'
                                         }: LeftHandNavigationDrawerProps) {
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

    return (
        <>
            <Box position="absolute" top={59} left={0} zIndex={1}>
                <RotatingChevron
                    placement="left"
                    onClick={toggleDrawer}
                    drawerState={drawerState}
                />
            </Box>

            <AnimatePresence>
                {drawerState !== "closed" && (
                    <MotionBox
                        position="fixed"
                        top={drawerState === "half-open" ? -6 : 0}
                        left={0}
                        bottom={0}
                        width={drawerState === "fully-open" ? 225 : 75}
                        zIndex={5}
                        bg="white"
                        boxShadow="xl"
                        initial={{x: "-100%", opacity: 0}}
                        animate={{x: 0, opacity: 1}}
                        exit={{x: "-100%", opacity: 0}}
                        transition={{type: "spring", stiffness: 300, damping: 30}}
                    >
                        <VStack align="stretch" height="100%" mt={20}>
                            {drawerState === "fully-open" && (
                                <Box px={4}>
                                    <h2 style={{color: theme.colors.perygonPink}}>{title}</h2>
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
                                    {menuItems && menuItems.length > 0 ? menuItems.map((item, index) => (
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
                                            {index < menuItems.length - 1 && (
                                                <Divider
                                                    borderColor={theme.colors.perygonPink}
                                                    opacity={0.2}
                                                    my={2}
                                                />
                                            )}
                                        </React.Fragment>
                                    )) : <Text>No menu items supplied</Text>}
                                </VStack>
                            </Box>
                        </VStack>

                        <Box
                            position="absolute"
                            bottom={55}
                            left={drawerState === "fully-open" ? 160 : 5}
                            zIndex={6}
                        >
                            <RotatingChevron
                                placement="right"
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
