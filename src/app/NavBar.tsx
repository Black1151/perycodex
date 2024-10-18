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
import {motion} from "framer-motion";
import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {
    Settings as SettingsIcon,
    Build as BuildIcon,
    Person as PersonIcon,
    Business as BusinessIcon,
    Lock as LockIcon,
    ExitToApp as ExitToAppIcon,
    Home as HomeIcon
} from "@mui/icons-material";

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

export const NavBar: React.FC<NavBarProps> = ({
                                                  userFirstName,
                                                  userImageUrl,
                                                  userRole,
                                                  logoImageUrl,
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
                icon: <HomeIcon/>,
                onClick: () => router.push('/'),
            },
            {
                label: "My Profile",
                icon: <PersonIcon/>,
                onClick: () => router.push("/my-profile"),
            },
            {
                label: "My Company",
                icon: <BusinessIcon/>,
                onClick: () => router.push('/my-company'),
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

        if (userRole === "PA") {
            setMenuItems([
                {
                    label: "Admin",
                    icon: <SettingsIcon/>,
                    onClick: () => router.push("/customers"),
                },
                ...commonMenuItems,
            ]);
        } else if (userRole === "CA") {
            setMenuItems([
                {
                    label: "Admin Tools",
                    icon: <SettingsIcon/>,
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
                    {greeting}, {userFirstName}!
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
                                userImageUrl && userImageUrl !== ""
                                    ? userImageUrl
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
