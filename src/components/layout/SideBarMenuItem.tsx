import React from "react";
import { Box, Flex, Text, Tooltip, useTheme } from "@chakra-ui/react";

interface SideBarMenuItemProps {
  label: string;
  icon: React.ReactElement;
  onClick: () => void;
  iconSize?: string | number;
  showIconOnly?: boolean;
  hoverStyles?: React.CSSProperties;
  isLeft?: boolean;
}

const SideBarMenuItem: React.FC<SideBarMenuItemProps> = ({
  label,
  icon,
  onClick,
  iconSize = "18px",
  showIconOnly = false,
  hoverStyles,
  isLeft = false,
}) => {
  const theme = useTheme();

  return (
    <Flex
      fontSize={16}
      flexDirection={isLeft ? "column" : "row"}
      alignItems="center"
      position="relative"
      overflow="hidden"
      color={theme.colors.perygonPink}
      borderRadius="md"
      border="1px solid transparent"
      _hover={{
        ...hoverStyles,
        cursor: "pointer",
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
