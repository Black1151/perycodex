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
      <MenuList bg="elementBG" color={theme.colors.themeTextColor} px={2}>
        {menuItems.map((item) => (
          <MenuItem
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
        <HStack maxHeight="40px" overflow="none">
          <Box pl={3}>
            <Palette />
          </Box>

          <Select
            fontSize={16}
            value={themeId!}
            onChange={(e) => setThemeId(Number(e.target.value))}
            bg="elementBG"
            borderColor={theme.colors.primary}
            maxWidth="210px"
            p={0}
            pb={5}
            px={1}
            mt={0}
            sx={{
              fontSize: 16,
              option: {
                backgroundColor: theme.colors.elementBG,
              },
            }}
          >
            {themeDropdownOptions.map((theme) => (
              <option key={theme.value} value={theme.value}>
                {theme.label}
              </option>
            ))}
          </Select>
        </HStack>
        <MenuItem
          key={"logout"}
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
