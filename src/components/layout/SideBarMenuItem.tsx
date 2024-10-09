import React from "react";
import { HStack, Text, Box, useTheme } from "@chakra-ui/react";

interface SideBarMenuItemProps {
  label: string;
  icon: React.ReactElement;
  onClick: () => void;
  iconSize?: string | number;
  showIconOnly?: boolean;
}

const SideBarMenuItem: React.FC<SideBarMenuItemProps> = ({
  label,
  icon,
  onClick,
  iconSize = "32px",
  showIconOnly = false,
}) => {
  const theme = useTheme();

  return (
    <HStack
      fontSize={18}
      display="flex"
      alignItems="center"
      position="relative"
      overflow="hidden"
      color={theme.colors.perygonPink}
      borderRadius="md"
      _hover={{
        backgroundColor: theme.colors.perygonPink,
        color: "white",
        cursor: "pointer",
      }}
      onClick={onClick}
      width="100%"
      p={2}
    >
      <Box
        boxSize={iconSize}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {icon}
      </Box>
      {!showIconOnly && (
        <Text flex={1} zIndex={2} ml={2}>
          {label}
        </Text>
      )}
    </HStack>
  );
};

export default SideBarMenuItem;
