"use client";

import {useTheme, Box, Flex, Container} from "@chakra-ui/react";
import React, {ReactNode} from "react";
import {NavBar} from "../NavBar";
import {Footer} from "@/components/layout/Footer";
import {UserProvider} from "@/context/AdminUserContext";
import {Business, Domain, EmojiPeople, GroupWork, People, PeopleAlt, Tag} from "@mui/icons-material";
import {useRouter} from "next/navigation";
import {LeftHandNavigationDrawer} from "@/components/layout/LeftHandNavigationDrawer";
import {RightHandNavigationDrawer} from "@/components/layout/RightHandNavigationDrawer";

interface AdminLayoutProps {
    children: ReactNode;
    userProps: {
        userFirstName: string;
        userImageUrl: string;
        userRole: string;
        userCustomerId: string;
        logoImageUrl?: string;
    };
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({children, userProps}) => {
    const theme = useTheme();
    const router = useRouter();


    // Helper to generate menu items based on userRole
    const generateSidebarItemsDrawer = (userRole: string) => {
        if (userRole === 'CA') {
            return [
                {
                    label: "My Company",
                    icon: <Business sx={{height: '100%', width: '100%'}}/>,
                    onClick: () => router.push('/my-company'),
                    category: "Internal"
                },
                {
                    label: "My Company Users",
                    icon: <People sx={{height: '100%', width: '100%'}}/>,
                    onClick: () => router.push('/users'),
                    category: "Internal"
                },
                {
                    label: "My Company Sites",
                    icon: <Domain sx={{height: '100%', width: '100%'}}/>,
                    onClick: () => router.push('/sites'),
                    category: "Internal"
                },
                {
                    label: "Teams",
                    icon: <GroupWork sx={{height: '100%', width: '100%'}}/>,
                    onClick: () => router.push('/teams'),
                    category: "Internal"
                },
                {
                    label: "User Groups",
                    icon: <PeopleAlt sx={{height: '100%', width: '100%'}}/>,
                    onClick: () => router.push('/user-groups'),
                    category: "Internal"
                },
                {
                    label: "Tags",
                    icon: <Tag sx={{height: '100%', width: '100%'}}/>,
                    onClick: () => router.push('/tags'),
                    category: "Internal"
                },
                {
                    label: "Our Clients",
                    icon: <Business sx={{height: '100%', width: '100%'}}/>,
                    onClick: () => router.push('/customers'),
                    category: "External"
                },
                {
                    label: "Our Clients Users",
                    icon: <People sx={{height: '100%', width: '100%'}}/>,
                    onClick: () => router.push('/users'),
                    category: "External"
                },
                {
                    label: "Our Clients Sites",
                    icon: <Domain sx={{height: '100%', width: '100%'}}/>,
                    onClick: () => router.push('/sites'),
                    category: "External"
                }
            ];
        } else if (userRole === 'PA') {
            return [
                {
                    label: "Customers",
                    icon: <EmojiPeople sx={{height: '100%', width: '100%'}}/>,
                    onClick: () => router.push('/customers'),
                    category: "Platform"
                },
                {
                    label: "Users",
                    icon: <People sx={{height: '100%', width: '100%'}}/>,
                    onClick: () => router.push('/users'),
                    category: "Platform"
                },
                {
                    label: "Sites",
                    icon: <Domain sx={{height: '100%', width: '100%'}}/>,
                    onClick: () => router.push('/sites'),
                    category: "Platform"
                },
                {
                    label: "User Groups",
                    icon: <PeopleAlt sx={{height: '100%', width: '100%'}}/>,
                    onClick: () => router.push('/user-groups'),
                    category: "Platform"
                },
                {
                    label: "Tags",
                    icon: <Tag sx={{height: '100%', width: '100%'}}/>,
                    onClick: () => router.push('/tags'),
                    category: "Platform"
                },
                {
                    label: "Workflow Admin",
                    icon: <GroupWork sx={{height: '100%', width: '100%'}}/>,
                    onClick: () => console.log("Other Workflow Admin Clicked"),
                    category: "Workflow"
                },
            ];
        }
        return [];
    };

    const menuItems = generateSidebarItemsDrawer(userProps.userRole);

    return (
        <UserProvider value={userProps}>
            <Flex
                minH="100vh"
                height={'100svh'}
                width="100%"
                overflowX="hidden"
                justifyContent={'center'}
                bgGradient={`linear(to-br, ${theme.colors.seduloRed}, ${theme.colors.perygonPink})`}
            >
                <NavBar {...userProps} />

                {/* Sidebar and content container */}
                <Flex flex={1} width="100%" mt={'60px'} mb={'30px'}>
                    {/* Sidebar */}
                    <LeftHandNavigationDrawer menuItems={menuItems} defaultDrawerState={'half-open'}/>
                    {/* Content Area */}
                    <Box flex={1} overflowY="auto" px={230} py={5}>
                        {children}
                    </Box>
                    <RightHandNavigationDrawer menuItems={menuItems}/>
                </Flex>
                <Footer/>
            </Flex>
        </UserProvider>
    );
};
