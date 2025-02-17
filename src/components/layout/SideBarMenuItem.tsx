import React from "react";
import {Box, Flex, Text, Tooltip, useTheme} from "@chakra-ui/react";

interface SideBarMenuItemProps {
    label: string;
    icon: React.ReactElement;
    onClick: () => void;
    iconSize?: string | number;
    showIconOnly?: boolean;
    hoverStyles?: React.CSSProperties;
    isLeft?: boolean;
    active?: boolean;
}

const SideBarMenuItem: React.FC<SideBarMenuItemProps> = ({
                                                             label,
                                                             icon,
                                                             onClick,
                                                             iconSize = "18px",
                                                             showIconOnly = false,
                                                             hoverStyles,
                                                             isLeft = false,
                                                             active = false,
                                                         }) => {
    const theme = useTheme();

    return (
        <Flex
            fontSize={16}
            flexDirection={isLeft ? "column" : "row"}
            alignItems="center"
            position="relative"
            overflow="hidden"
            color={active ? "white" : theme.colors.perygonPink}
            bg={active ? `linear-gradient(45deg, ${theme.colors.perygonPink}, ${theme.colors.seduloRed})` : "transparent"}
            borderRadius="md"
            border={active ? "1px solid white" : "1px solid transparent"}
            _hover={{
                ...hoverStyles,
                cursor: "pointer",
                background: active
                    ? `linear-gradient(45deg, ${theme.colors.perygonPink}, ${theme.colors.seduloRed})`
                    : hoverStyles?.background || theme.colors.gray[100],
                color: active ? "white" : hoverStyles?.color || theme.colors.perygonPink,
            }}
            onClick={onClick}
            width="100%"
            py={2}
        >
            {showIconOnly ? (
                <Tooltip label={label}>
                    <Box
                        boxSize={iconSize}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        {icon}
                    </Box>
                </Tooltip>
            ) : (
                <Box
                    boxSize={iconSize}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    {icon}
                </Box>
            )}
            {!showIconOnly && (
                <Text flex={1} zIndex={2} textAlign={"center"}>
                    {label}
                </Text>
            )}
        </Flex>
    );
};

export default SideBarMenuItem;
