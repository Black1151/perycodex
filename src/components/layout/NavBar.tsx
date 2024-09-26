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
import {
  Settings as SettingsIcon,
  Build as BuildIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Lock as LockIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";

const MotionBox = motion(Box);
const MotionHStack = motion(HStack);

export interface NavBarProps {
  userFirstName: string;
  userImageUrl: string;
  userRole: string;
}

interface MenuItemProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({
  userFirstName,
  userImageUrl,
  userRole,
}) => {
  const router = useRouter();
  const theme = useTheme();

  const handleLogout = async () => {
    await fetch("/api/auth/sign-out", {
      method: "POST",
    });
    router.push("/login");
  };

  const [menuItems, setMenuItems] = useState<MenuItemProps[]>([]);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (currentHour >= 6 && currentHour < 12) {
      setGreeting("Good Morning");
    } else if (currentHour >= 12 && currentHour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  useEffect(() => {
    const commonMenuItems: MenuItemProps[] = [
      {
        label: "My Tools",
        icon: <BuildIcon />,
        onClick: () => console.log("My Tools clicked"),
      },
      {
        label: "My Profile",
        icon: <PersonIcon />,
        onClick: () => console.log("Profile clicked"),
      },
      {
        label: "My Company",
        icon: <BusinessIcon />,
        onClick: () => console.log("My Company clicked"),
      },
      {
        label: "Change Password",
        icon: <LockIcon />,
        onClick: () => console.log("Change Password clicked"),
      },
      {
        label: "Logout",
        icon: <ExitToAppIcon />,
        onClick: handleLogout,
      },
    ];

    if (userRole === "PA") {
      setMenuItems([
        {
          label: "Admin",
          icon: <SettingsIcon />,
          onClick: () => router.push("/customers"),
        },
        ...commonMenuItems,
      ]);
    } else if (userRole === "CA") {
      setMenuItems([
        {
          label: "Admin Tools",
          icon: <BuildIcon />,
          onClick: () => router.push("/customers"),
        },
        ...commonMenuItems,
      ]);
    } else if (userRole === "CU") {
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
      position="fixed"
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
        <Text display={["none", null, "block"]} color="white" fontSize={18}>
          {greeting}, {userFirstName}!
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
          <MenuList
            bg="white"
            color={theme.colors.perygonPink}
            px={2}
            zIndex={10}
          >
            {menuItems.map((item) => (
              <MenuItem
                key={item.label}
                fontSize={16}
                display="flex"
                alignItems="center"
                position="relative"
                overflow="hidden"
                bg="white"
                borderRadius="md"
                _hover={{
                  backgroundColor: theme.colors.perygonPink,
                  color: "white",
                }}
                zIndex={2}
                onClick={item.onClick}
              >
                {item.icon}
                <Text zIndex={2} ml={2}>
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
