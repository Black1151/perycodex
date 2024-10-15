"use client";

import {useTheme, Box, Flex} from "@chakra-ui/react";
import React, {ReactNode} from "react";
import Sidebar from "./Sidebar";
import {NavBar} from "../NavBar";
import {Footer} from "@/components/layout/Footer";
import {UserProvider} from "@/context/AdminUserContext";
import {Business, Domain, EmojiPeople, GroupWork, People, PeopleAlt, Tag} from "@mui/icons-material";

interface AdminLayoutProps {
    children: ReactNode;
    userProps: {
        userFirstName: string;
        userImageUrl: string;
        userRole: string;
        userCustomerId: number | null;
    };
}


// Helper to generate sidebar items based on userRole
const generateSidebarItems = (userRole: string) => {
    if (userRole === 'CA') {
        return [
            { label: "My Company", icon: <Business fontSize="small"/>, path: '/my-company', category: "Internal" },
            { label: "My Company Users", icon: <People fontSize="small" />, path: '/users', category: "Internal" },
            { label: "My Company Sites", icon: <Domain fontSize="small" />, path: '/sites', category: "Internal" },
            { label: "Teams", icon: <GroupWork fontSize="small" />, path: '/teams', category: "Internal" },
            { label: "User Groups", icon: <PeopleAlt fontSize="small" />, path: '/user-groups', category: "Internal" },
            { label: "Tags", icon: <Tag fontSize="small" />, action: () => window.alert('Tags Clicked'), category: "Internal" },
            { label: "Our Clients", icon: <Business fontSize="small"/>, path: '/customers', category: "External" },
            { label: "Our Clients Users", icon: <People fontSize="small" />, path: '/users', category: "External" },
            { label: "Our Clients Sites", icon: <Domain fontSize="small" />, path: '/sites', category: "External" },
        ];
    } else if (userRole === 'PA') {
        return [
            { label: "Customers", icon: <EmojiPeople fontSize="small" />, path: '/customers', category: "Platform" },
            { label: "Users", icon: <People fontSize="small" />, path: '/users', category: "Platform" },
            { label: "Sites", icon: <Domain fontSize="small" />, path: '/sites', category: "Platform" },
            { label: "User Groups", icon: <PeopleAlt fontSize="small" />, path: '/user-groups', category: "Platform" },
            { label: "Tags", icon: <Tag fontSize="small" />, action: () => window.alert('Tags Clicked'), category: "Platform" },
            { label: "Other Workflow Admin", icon: <GroupWork fontSize="small" />, action: () => window.alert('Other Admin Clicked'), category: "Workflow" },
        ];
    }
    return [];
};


export const AdminLayout: React.FC<AdminLayoutProps> = ({children, userProps}) => {
    const theme = useTheme();

    // Generate sidebar items based on userRole
    const sidebarItems = generateSidebarItems(userProps.userRole);

    return (
        <UserProvider value={userProps}>
            <Flex
                minH="100vh"
                height={'100svh'}
                width="100%"
                overflowX="hidden"
                bgGradient={`linear(to-br, ${theme.colors.seduloRed}, ${theme.colors.perygonPink})`}
            >
                <NavBar {...userProps} />

                {/* Sidebar and content container */}
                <Flex flex={1} width="100%" mt={'60px'} mb={'30px'}>
                    {/* Sidebar */}
                    <Sidebar items={sidebarItems} />

                    {/* Content Area */}
                    <Box flex={1} p={5} overflowY="auto">
                        {children}
                    </Box>
                </Flex>
                <Footer/>
            </Flex>
        </UserProvider>
    );
};
