import React from "react";
import { Box, Flex, Text, Tooltip, useTheme } from "@chakra-ui/react";
import { Lock } from "@mui/icons-material";

interface SideBarMenuItemProps {
  label: string;
  icon: React.ReactElement;
  onClick: () => void;
  iconSize?: string | number;
  showIconOnly?: boolean;
  hoverStyles?: React.CSSProperties;
  isLeft?: boolean;
  active?: boolean;
  locked?: boolean;
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
  locked = false,
}) => {
  const theme = useTheme();

  return (
    <Flex
      pos="relative"
      fontSize={16}
      flexDirection={isLeft ? "column" : "row"}
      alignItems="center"
      overflow="hidden"
      width="100%"
      py={2}
      color={
        locked
          ? theme.colors.gray[400]
          : active
          ? "white"
          : theme.colors.primary
      }
      bg={
        locked
          ? theme.colors.gray[100]
          : active
          ? `linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.secondary})`
          : "transparent"
      }
      borderRadius="md"
      border={
        active
          ? "1px solid white"
          : locked
          ? "1px solid" + theme.colors.gray[300]
          : "1px solid transparent"
      }
      _hover={
        locked
          ? undefined
          : {
              ...hoverStyles,
              cursor: "pointer",
              border: `1px solid ${theme.colors.primary}`,
              color: active ? "white" : hoverStyles?.color || theme.colors.primary,
            }
      }
      onClick={() => {
        if (!locked) onClick();
      }}
      pointerEvents={locked ? "none" : "auto"}
      cursor={locked ? "not-allowed" : "pointer"}
    >
      {showIconOnly ? (
        <Tooltip label={label} hasArrow placement="right">
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
        <Text flex={1} zIndex={2} textAlign="center">
          {label}
        </Text>
      )}

      {locked && !showIconOnly && (
        <Box
          pos="absolute"
          top={2}
          right={2}
          zIndex={3}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Lock
            style={{
              fontSize: theme.sizes[4],
              color: theme.colors.gray[500],
            }}
          />
        </Box>
      )}
    </Flex>
  );
};

export default SideBarMenuItem;
