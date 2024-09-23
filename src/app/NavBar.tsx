"use client";

import {
  HStack,
  Box,
  Image,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useTheme,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const MotionBox = motion(Box);
const MotionHStack = motion(HStack);

export interface NavBarProps {
  userFirstName: string;
  userImageUrl: string;
  userRole: string;
}

interface MenuItemProps {
  label: string;
  onClick: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({
  userFirstName,
  userImageUrl,
  userRole,
}) => {
  const router = useRouter();
  const theme = useTheme();

  // Logout function
  const handleLogout = async () => {
    await fetch("/api/auth/sign-out", {
      method: "POST",
    });
    router.push("/login");
  };

  const [menuItems, setMenuItems] = useState<MenuItemProps[]>([]);

  useEffect(() => {
    const commonMenuItems: MenuItemProps[] = [
      { label: "Options", onClick: () => console.log("Options clicked") },
      { label: "My Tools", onClick: () => console.log("My Tools clicked") },
      { label: "My Profile", onClick: () => console.log("Profile clicked") },
      { label: "My Company", onClick: () => console.log("My Company clicked") },
      {
        label: "Change Password",
        onClick: () => console.log("Change Password clicked"),
      },
      { label: "Logout", onClick: handleLogout },
    ];

    if (userRole === "PA") {
      setMenuItems([
        { label: "Admin", onClick: () => console.log("Admin clicked") },
        ...commonMenuItems,
      ]);
    } else if (userRole === "CA") {
      setMenuItems([
        {
          label: "Admin Tools",
          onClick: () => console.log("Admin Tools clicked"),
        },
        ...commonMenuItems,
      ]);
    } else if (["CU", "CS", "CL"].includes(userRole)) {
      setMenuItems([...commonMenuItems]);
    }
  }, [userRole]);

  return (
    <HStack
      gap={[5, 20]}
      px={5}
      width="100%"
      fontSize={[20, 40]}
      justifyContent="space-between"
      alignItems="center"
      pt={5}
    >
      <MotionBox
        initial={{ x: "-5vw", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        w="150px"
      >
        <Image
          src="/logoWhole.png"
          alt="logo"
          width="100%"
          height="100%"
          objectFit="cover"
        />
      </MotionBox>
      <MotionHStack
        initial={{ x: "5vw", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        justifyContent="center"
        alignItems="center"
        gap={8}
      >
        <Text
          display={["none", null, "block"]}
          fontFamily="Bonfire"
          color="white"
          fontSize={30}
          pt={3}
        >
          Hello {userFirstName}!
        </Text>

        <Menu>
          <MenuButton
            as={Box}
            borderRadius="50%"
            overflow="hidden"
            width="40px"
            height="40px"
            _hover={{ cursor: "pointer" }}
          >
            <Image
              src={userImageUrl ?? "blank-profile-picture.webp"}
              alt="profile pic"
              width="100%"
              height="100%"
              objectFit="cover"
            />
          </MenuButton>
          <MenuList bg="white" color={theme.colors.perygonPink}>
            {menuItems.map((item) => (
              <MenuItem
                key={item.label}
                fontSize={25}
                display="flex"
                position="relative"
                overflow="hidden"
                _before={{
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  backgroundColor: theme.colors.perygonPink,
                  transition: "left 0.3s ease",
                  zIndex: 1,
                }}
                _hover={{
                  color: "white",
                  _before: {
                    left: 0,
                  },
                }}
                _after={{
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: "100%",
                  width: "100%",
                  height: "100%",
                  backgroundColor: theme.colors.perygonPink,
                  transition: "left 0.3s ease",
                  zIndex: 1,
                }}
                zIndex={2}
                onClick={item.onClick}
              >
                <Text display="flex" flex={1} zIndex={2}>
                  {item.label}
                </Text>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </MotionHStack>
    </HStack>
  );
};
