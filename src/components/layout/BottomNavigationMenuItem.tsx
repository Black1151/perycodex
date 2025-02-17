import React from "react";
import {Box, Divider, Text, useTheme, VStack} from "@chakra-ui/react";

export interface MenuItem {
    label: string;
    icon: React.ReactElement;
    onClick: () => void;
    active?: boolean;
}

interface BottomNavigationMenuItemProps {
    menuItem: MenuItem;
    iconSize?: string | number;
    hoverStyles?: React.CSSProperties;
}

const BottomNavigationMenuItem: React.FC<BottomNavigationMenuItemProps> = ({
                                                                               menuItem,
                                                                               iconSize = "24px",
                                                                               hoverStyles,
                                                                           }) => {
    const theme = useTheme();

    return (
        <VStack
            spacing={1}
            align="center"
            justify="center"
            alignItems="center"
            onClick={menuItem.onClick}
            cursor="pointer"
            minWidth={81}
            py={2}
            h={'full'}
            bg={
                menuItem.active
                    ? `linear-gradient(45deg, ${theme.colors.perygonPink}, ${theme.colors.seduloRed})`
                    : "transparent"
            }
            color={menuItem.active ? "white" : theme.colors.perygonPink}
            _hover={{
                ...hoverStyles,
                backgroundColor: menuItem.active
                    ? `linear-gradient(45deg, ${theme.colors.perygonPink}, ${theme.colors.seduloRed})`
                    : hoverStyles?.background || theme.colors.gray[100],
                color: menuItem.active ? "white" : hoverStyles?.color || theme.colors.perygonPink,
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
                {menuItem.icon}
            </Box>
            <Divider maxWidth={70} borderColor={menuItem.active ? "white" : theme.colors.perygonPink}/>
            <Text fontSize={10}>
                {menuItem.label}
            </Text>
        </VStack>
    );
};

export default BottomNavigationMenuItem;
