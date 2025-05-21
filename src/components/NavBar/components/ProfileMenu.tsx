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
  useBreakpointValue,
  Select,
  HStack,
} from "@chakra-ui/react";
import PersonIcon from "@mui/icons-material/Person";
import { Celebration, ExitToApp, Palette } from "@mui/icons-material";

import PulsatingIcon from "./PulsatingIcon";
import { MenuItemProps } from "./types";
import { useThemeContext } from "@/providers/ChakraThemeProvider";
import { ThemeDropdownOption } from "../NavBar";

interface ProfileMenuProps {
  userImageUrl: string;
  menuItems: MenuItemProps[];
  unread: boolean;
  themeDropdownOptions: ThemeDropdownOption[];
  handleLogout: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  userImageUrl,
  menuItems,
  unread,
  themeDropdownOptions,
  handleLogout,
}) => {
  const theme = useTheme();
  const { setThemeId, themeId } = useThemeContext();

  const pulsatingIconSize = useBreakpointValue({ base: 20, md: 25 });

  return (
    // Prevent auto-closing while interacting with the Select
    <Menu closeOnSelect={false}>
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

      <MenuList bg="elementBG" color={theme.colors.themeTextColor} px={2}>
        {menuItems.map((item) => (
          <MenuItem
            closeOnSelect
            key={item.label}
            fontSize={[14, 16, 18]}
            display="flex"
            alignItems="center"
            position="relative"
            overflow="hidden"
            bg="elementBG"
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

        {themeDropdownOptions[0] && (
          <HStack px={3} py={2}>
            <Palette />
            <Select
              fontSize={16}
              value={themeId!}
              onChange={(e) => setThemeId(Number(e.target.value))}
              bg="elementBG"
              borderColor={theme.colors.primary}
              maxWidth="210px"
              sx={{
                fontSize: [14, 16, 18],
                option: {
                  backgroundColor: theme.colors.elementBG,
                },
              }}
            >
              {themeDropdownOptions.map((themeOption) => (
                <option key={themeOption.value} value={themeOption.value}>
                  {themeOption.label}
                </option>
              ))}
            </Select>
          </HStack>
        )}

        <MenuItem
          closeOnSelect
          key="logout"
          fontSize={[14, 16, 18]}
          display="flex"
          alignItems="center"
          position="relative"
          overflow="hidden"
          bg="elementBG"
          borderRadius="md"
          _hover={{
            backgroundColor: theme.colors.primary,
            color: "white",
          }}
          onClick={handleLogout}
        >
          <ExitToApp />
          <Text flex={1} zIndex={2} ml={2}>
            Logout
          </Text>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default ProfileMenu;
