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
                                             defaultDrawerState = "closed",
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

    // Group menu items by category
    const groupedItems = menuItems?.reduce((acc, item) => {
        const category = item.category || "uncategorized";
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {} as Record<string, MenuItem[]>) || {};

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
                        <VStack align="stretch" height="100%" pt={'60px'}>
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
                                    {Object.entries(groupedItems).map(
                                        ([category, itemsInCategory], categoryIndex) => (
                                            <React.Fragment key={categoryIndex}>
                                                {/* Category Name */}
                                                {category !== "uncategorized" && drawerState === "fully-open" && (
                                                    <Box
                                                        borderRadius="md"
                                                        mb={4} // Margin below category for spacing
                                                    >
                                                        <Text
                                                            fontWeight="bold"
                                                            fontSize="lg"
                                                            color={theme.colors.gray[600]} // Darker color for better contrast
                                                            mb={2}
                                                        >
                                                            {category}
                                                        </Text>

                                                        {/* Divider below category title */}
                                                        <Divider borderColor={theme.colors.perygonPink} opacity={0.5}/>
                                                    </Box>
                                                )}

                                                {/* Menu Items in the Category */}
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
                                                {/*Divider between categories*/}
                                                {categoryIndex < Object.keys(groupedItems).length - 1 && (
                                                    <Divider
                                                        borderColor={theme.colors.perygonPink}
                                                        opacity={0.8}
                                                        my={6} // Add more margin for clearer separation
                                                    />
                                                )}
                                            </React.Fragment>
                                        )
                                    )}

                                    {/* If no menu items */}
                                    {!menuItems && drawerState === 'fully-open' && (
                                        <Text>No menu items supplied</Text>
                                    )}
                                </VStack>
                            </Box>
                        </VStack>

                        <Box
                            position="absolute"
                            bottom={55}
                            left={drawerState === "fully-open" ? 160 : 0}
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
