// components/NavBar/ProfileMenu.tsx
import React from "react";
import {
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Image,
  Flex,
  Text,
  useTheme,
  MenuDivider,
  MenuGroup,
  useBreakpointValue,
} from "@chakra-ui/react";
import PersonIcon from "@mui/icons-material/Person";
import { Celebration } from "@mui/icons-material";

import PulsatingIcon from "./PulsatingIcon";
import { MenuItemProps } from "./types";
import { useThemeContext } from "@/providers/ChakraThemeProvider";
import { ThemeName, themeRegistry } from "@/theme/themes/themeRegistry";

interface ProfileMenuProps {
  userImageUrl: string;
  menuItems: MenuItemProps[];
  unread: boolean;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  userImageUrl,
  menuItems,
  unread,
}) => {
  // Current active theme from Chakra (useTheme) - primarily used for any styling references
  const theme = useTheme();

  // Access the theme-switching logic from your Theme Context
  const { setThemeName } = useThemeContext();

  // List of all possible theme options
  const allThemes = Object.keys(themeRegistry) as ThemeName[];

  const pulsatingIconSize = useBreakpointValue({ base: 20, md: 25 });

  return (
    <Menu>
      <Box position="relative">
        <MenuButton
          as={Box}
          borderRadius="50%"
          overflow="hidden"
          width="40px"
          height="40px"
          _hover={{ cursor: "pointer" }}
        >
          {userImageUrl ? (
            <Image
              src={userImageUrl}
              alt="profile pic"
              width="100%"
              height="100%"
              objectFit="cover"
            />
          ) : (
            <Flex
              bg="gray.100"
              width="full"
              height="full"
              align="center"
              justify="center"
            >
              <PersonIcon
                sx={{
                  color: theme.colors.primary,
                  width: "100%",
                  height: "100%",
                }}
              />
            </Flex>
          )}
        </MenuButton>

        {unread && (
          <PulsatingIcon
            icon={
              <Celebration
                sx={{
                  color: "white",
                  height: "15px",
                  width: "15px",
                }}
              />
            }
            size={pulsatingIconSize}
          />
        )}
      </Box>

      {/* The main menu content */}
      <MenuList bg="white" color={theme.colors.primary} px={2}>
        {/* Render your existing menu items */}
        {menuItems.map((item) => (
          <MenuItem
            key={item.label}
            fontSize={[14, 16, 18]}
            display="flex"
            alignItems="center"
            position="relative"
            overflow="hidden"
            bg="white"
            borderRadius="md"
            _hover={{
              backgroundColor: theme.colors.primary,
              color: "white",
            }}
            onClick={item.onClick}
          >
            {item.icon}
            <Text flex={1} zIndex={2} ml={2}>
              {item.label}
            </Text>
          </MenuItem>
        ))}

        {/* Add a horizontal divider before the theme switching group */}
        <MenuDivider />

        {/* Group for theme switching */}
        <MenuGroup title="Switch Theme">
          {allThemes.map((tName) => (
            <MenuItem
              key={tName}
              onClick={() => setThemeName(tName)}
              fontSize={[14, 16, 18]}
              _hover={{
                backgroundColor: theme.colors.primary,
                color: "white",
              }}
              // You can highlight the current theme if you like:
              // bg={themeName === tName ? theme.colors.primary : "white"}
              // color={themeName === tName ? "white" : theme.colors.primary}
            >
              {tName}
            </MenuItem>
          ))}
        </MenuGroup>
      </MenuList>
    </Menu>
  );
};

export default ProfileMenu;
