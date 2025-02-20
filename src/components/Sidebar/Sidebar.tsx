"use client";

import React from 'react';
import {Box, VStack, HStack, Heading, useTheme, Center, Spinner} from "@chakra-ui/react";
import {ChevronLeft, ChevronRight, Close, Menu, SvgIconComponent} from "@mui/icons-material";
import useDrawerState, {DrawerStateOptions} from "@/components/Sidebar/useDrawerState";

type SidebarSide = 'left' | 'right';

export interface SidebarProps {
    initialState?: DrawerStateOptions;
    title?: string;
    side?: SidebarSide;
    loading?: boolean
    halfOpenContent?: React.ReactNode;
    fullyOpenContent?: React.ReactNode;
    openButtonIcon?: SvgIconComponent;
}

const Sidebar: React.FC<SidebarProps> = ({
                                             initialState = "closed",
                                             title,
                                             side = "left",
                                             loading = false,
                                             halfOpenContent,
                                             fullyOpenContent,
                                             openButtonIcon
                                         }) => {
    const theme = useTheme();

    const canHalf = !!halfOpenContent;
    const canFull = !!fullyOpenContent;
    const {drawerState, openDrawer, closeDrawer, toggleDrawer} = useDrawerState({initialState, canHalf, canFull})

    const isLeft = side === "left";

    const collapseIcon = isLeft ? (
        <ChevronLeft style={{fontSize: "1.4rem", cursor: "pointer"}}/>
    ) : (
        <ChevronRight style={{fontSize: "1.4rem", cursor: "pointer"}}/>
    );

    const expandIcon = isLeft ? (
        <ChevronRight style={{fontSize: "1.4rem", cursor: "pointer"}}/>
    ) : (
        <ChevronLeft style={{fontSize: "1.4rem", cursor: "pointer"}}/>
    );

    const OpenIcon = openButtonIcon || Menu;

    const floatButtonProps = isLeft
        ? {left: 5, right: "auto"}
        : {right: 5, left: "auto"};

    if (drawerState === "closed" && (canFull || canHalf)) {
        return (
            <Box
                position="absolute"
                top={78}
                {...floatButtonProps}
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
                <OpenIcon
                    onClick={openDrawer}
                    cursor="pointer"
                    style={{fontSize: "1.5rem"}}
                />
            </Box>
        )
    }

    if (canHalf || canFull) {
        return (
            <Box
                display={["none", "none", "block"]}
                position="fixed"
                top={0}
                {...(isLeft ? {left: 0} : {right: 0})}
                bottom={0}
                width={drawerState === "fully-open" ? 225 : 61}
                zIndex={5}
                bg="white"
                boxShadow="xl"
                gap={0}
            >
                <VStack height="100%" pt={"60px"} spacing={0}>
                    <HStack alignItems="center" justify={'space-between'} background={'white'} py={1} px={2}
                            zIndex={100} w={'full'}>
                        {title && drawerState === "fully-open" && (
                            <Heading as={'h2'} fontSize={'16px'}
                                     style={{color: theme.colors.perygonPink}}>{title}</Heading>
                        )}
                        <HStack spacing={2}
                                justify={side === 'left' ? 'flex-end' : drawerState === 'fully-open' ? 'flex-end' : 'flex-start'}
                                flex={1}>
                            {drawerState === "fully-open" && canHalf && (
                                <Box
                                    color={theme.colors.perygonPink}
                                    onClick={toggleDrawer}
                                    m={0}
                                    p={0}
                                    zIndex={1}
                                >
                                    {collapseIcon}
                                </Box>

                            )}
                            {drawerState === "half-open" && canFull && (
                                <Box
                                    color={theme.colors.perygonPink}
                                    onClick={toggleDrawer}
                                    m={0}
                                    p={0}
                                    zIndex={1}
                                >
                                    {expandIcon}
                                </Box>
                            )}
                            {(
                                (drawerState === "half-open" && canFull === false)
                                || (drawerState === "fully-open")
                            ) && (
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
                            )}
                        </HStack>
                    </HStack>
                    {/* Content with Loading State */}
                    <Box px={2} flex={1} overflowY={'auto'} w={'full'}>
                        {loading ? (
                            <Center h="100%">
                                <Spinner size="lg" color={theme.colors.perygonPink}/>
                            </Center>
                        ) : (
                            <>
                                {drawerState === "half-open" && halfOpenContent}
                                {drawerState === "fully-open" && fullyOpenContent}
                            </>
                        )}
                    </Box>
                </VStack>
            </Box>
        )
    }
};
export default Sidebar;
