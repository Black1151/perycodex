import React from "react";
import { VStack, Text, Box, useTheme, Divider } from "@chakra-ui/react";

export interface MenuItem {
  label: string;
  icon: React.ReactElement;
  onClick: () => void;
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
      _hover={{
        ...hoverStyles,
        backgroundColor: theme.colors.gray[100],
      }}
      textAlign="center"
    >
      <Box
        boxSize={iconSize}
        display="flex"
        alignItems="center"
        justifyContent="center"
        color={theme.colors.perygonPink}
      >
        {menuItem.icon}
      </Box>
      <Divider maxWidth={70} borderColor={theme.colors.perygonPink} />
      <Text fontSize={10} color={theme.colors.gray[700]}>
        {menuItem.label}
      </Text>
    </VStack>
  );
};

export default BottomNavigationMenuItem;
