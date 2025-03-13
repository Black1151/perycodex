import React from "react";
import {Box, Divider, Text, useTheme, VStack} from "@chakra-ui/react";

interface BottomNavigationMenuItemProps {
    label: string;
    icon: React.ReactElement;
    onClick: () => void;
    iconSize?: string | number;
    hoverStyles?: React.CSSProperties;
    active?: boolean;
}

const BottomNavigationMenuItem: React.FC<BottomNavigationMenuItemProps> = ({
                                                                               label,
                                                                               icon,
                                                                               onClick,
                                                                               iconSize = "24px",
                                                                               hoverStyles,
                                                                               active = false
                                                                           }) => {
    const theme = useTheme();

    return (
        <VStack
            spacing={1}
            align="center"
            justify="center"
            alignItems="center"
            onClick={onClick}
            cursor="pointer"
            minWidth={81}
            py={2}
            h={'full'}
            bg={
                active
                    ? `linear-gradient(45deg, ${theme.colors.perygonPink}, ${theme.colors.seduloRed})`
                    : "transparent"
            }
            color={active ? "white" : theme.colors.perygonPink}
            _hover={{
                ...hoverStyles,
                backgroundColor: active
                    ? `linear-gradient(45deg, ${theme.colors.perygonPink}, ${theme.colors.seduloRed})`
                    : hoverStyles?.background || theme.colors.gray[100],
                color: active ? "white" : hoverStyles?.color || theme.colors.perygonPink,
            }}
            textAlign="center"
            borderRadius="md"
        >
            <Box
                boxSize={iconSize}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                {icon}
            </Box>
            <Divider maxWidth={70} borderColor={active ? "white" : theme.colors.perygonPink}/>
            <Text fontSize={10}>
                {label}
            </Text>
        </VStack>
    );
};

export default BottomNavigationMenuItem;
