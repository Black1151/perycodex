"use client";

import {Box, HStack, Image, Menu, MenuButton, MenuItem, MenuList, Text, useTheme} from "@chakra-ui/react";
import {motion} from "framer-motion";
import {useRouter} from "next/navigation";
import {
    Business as BusinessIcon,
    ExitToApp as ExitToAppIcon,
    Home as HomeIcon,
    Lock as LockIcon,
    Person as PersonIcon,
    Settings as SettingsIcon,
} from "@mui/icons-material";
import {useUser} from "@/providers/UserProvider";

const MotionBox = motion(Box);
const MotionHStack = motion(HStack);

export interface NavBarProps {
    userFirstName: string;
    userImageUrl: string;
    userRole: string;
    logoImageUrl?: string;
}

interface MenuItemProps {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
}

export const NavBar = ({}) => {
    const router = useRouter();
    const theme = useTheme();
    const {user} = useUser();

    let logoImageUrl;

    const handleLogout = async () => {
        await fetch("/api/auth/sign-out", {
            method: "POST",
        });
        router.push("/login");
    };

    // Compute greeting based on the current time
    const getGreeting = () => {
        const currentTime = new Date();
        const currentHour = currentTime.getHours();

        if (currentHour >= 6 && currentHour < 12) {
            return "Good Morning";
        } else if (currentHour >= 12 && currentHour < 18) {
            return "Good Afternoon";
        } else {
            return "Good Evening";
        }
    };

    const greeting = getGreeting();

    // Compute menu items based on user role
    const getMenuItems = (): MenuItemProps[] => {
        const commonMenuItems: MenuItemProps[] = [
            {
                label: "My Tools",
                icon: <HomeIcon/>,
                onClick: () => router.push("/"),
            },
            {
                label: "My Profile",
                icon: <PersonIcon/>,
                onClick: () => router.push("/my-profile"),
            },
            {
                label: "My Company",
                icon: <BusinessIcon/>,
                onClick: () => router.push("/my-company"),
            },
            {
                label: "Change Password",
                icon: <LockIcon/>,
                onClick: () => console.log("Change Password clicked"),
            },
            {
                label: "Logout",
                icon: <ExitToAppIcon/>,
                onClick: handleLogout,
            },
        ];

        if (user?.role === "PA") {
            return [
                {
                    label: "Admin",
                    icon: <SettingsIcon/>,
                    onClick: () => router.push("/customers"),
                },
                ...commonMenuItems,
            ];
        } else if (user?.role === "CA") {
            return [
                {
                    label: "Admin Tools",
                    icon: <SettingsIcon/>,
                    onClick: () => router.push("/customers"),
                },
                ...commonMenuItems,
            ];
        } else {
            return commonMenuItems;
        }
    };

    const menuItems = getMenuItems();

    return (
        <HStack
            gap={[5, 20]}
            px={5}
            width="100%"
            fontSize={[20, 40]}
            justifyContent="space-between"
            alignItems="center"
            height="60px"
            position="fixed"
            top={0}
            left={0}
            right={0}
            zIndex={100}
            bgGradient={theme.gradients.perygonBackground}
            borderBottom="white 1px solid"
        >
            <MotionBox
                initial={{x: "-5vw", opacity: 0}}
                animate={{x: 0, opacity: 1}}
                transition={{duration: 0.3}}
                w="150px"
                display="flex"
            >
                {logoImageUrl && logoImageUrl !== "" ? (
                    <Image
                        src={logoImageUrl}
                        alt="logo"
                        height="50px"
                        objectFit="contain"
                    />
                ) : (
                    <Text
                        fontFamily="bonfire"
                        fontSize={[30, 40]}
                        bgClip="text"
                        color="white"
                    >
                        Perygon
                    </Text>
                )}
            </MotionBox>
            <MotionHStack
                initial={{x: "5vw", opacity: 0}}
                animate={{x: 0, opacity: 1}}
                transition={{duration: 0.3}}
                justifyContent="center"
                alignItems="center"
                gap={8}
            >
                <Text display={["none", null, "block"]} color="white" fontSize={18}>
                    {greeting}, {user?.firstName}!
                </Text>

                <Menu>
                    <MenuButton
                        as={Box}
                        borderRadius="50%"
                        overflow="hidden"
                        width="40px"
                        height="40px"
                        _hover={{cursor: "pointer"}}
                    >
                        <Image
                            src={
                                user?.userImageUrl && user?.userImageUrl !== ""
                                    ? user?.userImageUrl
                                    : "blank-profile-picture.webp"
                            }
                            alt="profile pic"
                            width="100%"
                            height="100%"
                            objectFit="cover"
                        />
                    </MenuButton>
                    <MenuList bg="white" color={theme.colors.perygonPink} px={2}>
                        {menuItems.map((item) => (
                            <MenuItem
                                key={item.label}
                                fontSize={18}
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
                                onClick={item.onClick}
                            >
                                {item.icon}
                                <Text flex={1} zIndex={2} ml={2}>
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
