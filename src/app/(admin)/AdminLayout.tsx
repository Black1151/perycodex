"use client";

import { useTheme, Box, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { NavBar } from "../NavBar";

interface AdminLayoutProps {
  children: ReactNode;
  navBarProps: {
    userFirstName: string;
    userImageUrl: string;
    userRole: string;
  };
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  navBarProps,
}) => {
  const theme = useTheme();

  return (
    <Box
      minH="100vh"
      width="100%"
      overflowX="hidden"
      bgGradient={`linear(to-br, ${theme.colors.seduloRed}, ${theme.colors.perygonPink})`}
    >
      {/* Fixed Navbar */}
      <Box position="fixed" top={0} left={0} width="100%" zIndex={1000}>
        <NavBar {...navBarProps} />
      </Box>

      {/* Sidebar and content container */}
      <Flex marginTop="80px" width="100%" height="calc(100vh - 80px)">
        {/* Sidebar */}
        <Sidebar />

        {/* Content Area */}
        <Box flex={1} p={5} overflowY="auto">
          {children}
        </Box>
      </Flex>
    </Box>
  );
};
