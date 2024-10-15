"use client";

import {useTheme, Box, Flex} from "@chakra-ui/react";
import React, {ReactNode} from "react";
import Sidebar from "./Sidebar";
import {NavBar} from "../NavBar";
import {Footer} from "@/components/layout/Footer";
import {UserProvider} from "@/context/AdminUserContext";

interface AdminLayoutProps {
    children: ReactNode;
    userProps: {
        userFirstName: string;
        userImageUrl: string;
        userRole: string;
        userCustomerId: number | null;
    };
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({children, userProps}) => {
    const theme = useTheme();

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
                    <Sidebar/>

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
