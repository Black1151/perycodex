"use client"; // Mark this as a client component

import { ReactNode } from "react";
import { LeftHandNavigationDrawer } from "@/components/layout/LeftHandNavigationDrawer";
import { Flex, Box } from "@chakra-ui/react";
import {
  Person,
  LocationOn,
  People,
  Groups,
  Sell,
  AddReaction,
  FormatListNumbered,
  Checklist,
  Construction,
  AccountTree,
  Schema,
  FormatAlignCenter,
  Grid4x4,
  Domain,
} from "@mui/icons-material";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/AdminUserContext";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const userProps = useUser();

  const generateSidebarItemsDrawer = (userRole: string) => {
    if (userRole === "CA") {
      return [
        {
          label: "My Company",
          icon: <Domain sx={{ height: "100%", width: "100%" }} />,
          onClick: () => router.push("/my-company"),
          category: "Internal",
        },
        {
          label: "My Company Users",
          icon: <Person sx={{ height: "100%", width: "100%" }} />,
          onClick: () => router.push("/users?userType=internal"),
          category: "Internal",
        },
        {
          label: "My Company Sites",
          icon: <LocationOn sx={{ height: "100%", width: "100%" }} />,
          onClick: () => router.push("/sites?siteType=internal"),
          category: "Internal",
        },
        {
          label: "Teams",
          icon: <People sx={{ height: "100%", width: "100%" }} />,
          onClick: () => router.push("/teams"),
          category: "Internal",
        },
        {
          label: "User Groups",
          icon: <Groups sx={{ height: "100%", width: "100%" }} />,
          onClick: () => router.push("/user-groups"),
          category: "Internal",
        },
        {
          label: "Tags",
          icon: <Sell sx={{ height: "100%", width: "100%" }} />,
          onClick: () => router.push("/tags"),
          category: "Internal",
        },
        {
          label: "Our Clients",
          icon: <Domain sx={{ height: "100%", width: "100%" }} />,
          onClick: () => router.push("/customers?customerType=external"),
          category: "External",
        },
        {
          label: "Our Clients Users",
          icon: <Person sx={{ height: "100%", width: "100%" }} />,
          onClick: () => router.push("/users?userType=external"),
          category: "External",
        },
        {
          label: "Our Clients Sites",
          icon: <LocationOn sx={{ height: "100%", width: "100%" }} />,
          onClick: () => router.push("/sites?siteType=external"),
          category: "External",
        },
        {
          label: "Test Happiness",
          icon: <AddReaction sx={{ height: "100%", width: "100%" }} />,
          onClick: () =>
            router.push("/test-happiness-score?workflowId=1&toolId=1"),
          category: "Test Survey",
        },
      ];
    } else if (userRole === "PA") {
      return [
        {
          label: "Customers",
          icon: <Domain sx={{ height: "100%", width: "100%" }} />,
          onClick: () => router.push("/customers"),
          category: "Platform",
        },
        {
          label: "Users",
          icon: <Person sx={{ height: "100%", width: "100%" }} />,
          onClick: () => router.push("/users"),
          category: "Platform",
        },
        {
          label: "Sites",
          icon: <LocationOn sx={{ height: "100%", width: "100%" }} />,
          onClick: () => router.push("/sites"),
          category: "Platform",
        },
        {
          label: "User Groups",
          icon: <Groups sx={{ height: "100%", width: "100%" }} />,
          onClick: () => router.push("/user-groups"),
          category: "Platform",
        },
        {
          label: "Tags",
          icon: <Sell sx={{ height: "100%", width: "100%" }} />,
          onClick: () => router.push("/tags"),
          category: "Platform",
        },
        {
          label: "Option Lists",
          icon: <FormatListNumbered sx={{ height: "100%", width: "100%" }} />,
          onClick: () => router.push("/option-lists"),
          category: "Platform",
        },
        {
          label: "Select Items",
          icon: <Checklist sx={{ height: "100%", width: "100%" }} />,
          onClick: () => router.push("/select-items"),
          category: "Platform",
        },
        {
          label: "Tool",
          icon: <Construction sx={{ height: "100%", width: "100%" }} />,
          onClick: () => router.push("/tools"),
          category: "Workflows",
        },
        {
          label: "Workflow",
          icon: <AccountTree sx={{ height: "100%", width: "100%" }} />,
          onClick: () => router.push("/workflows"),
          category: "Workflows",
        },
        {
          label: "Business Process",
          icon: <Schema sx={{ height: "100%", width: "100%" }} />,
          onClick: () => router.push("/business-processes"),
          category: "Workflows",
        },
        {
          label: "Forms",
          icon: <FormatAlignCenter sx={{ height: "100%", width: "100%" }} />,
          onClick: () => router.push("/forms"),
          category: "Workflows",
        },
        {
          label: "Test Happiness",
          icon: <AddReaction sx={{ height: "100%", width: "100%" }} />,
          onClick: () =>
            router.push("/test-happiness-score?workflowId=1&toolId=1"),
          category: "Test Survey",
        },
        {
          label: "Drag Grids Test",
          icon: <Grid4x4 sx={{ height: "100%", width: "100%" }} />,
          onClick: () => router.push("/grid-test"),
          category: "Grid Test",
        },
      ];
    }
    return [];
  };

  const menuItems = generateSidebarItemsDrawer(userProps.role);

  return (
    <Flex flex={1} width="100%" mt={"60px"} mb={"30px"}>
      {!["/my-profile", "/my-company"].includes(pathname) && (
        <LeftHandNavigationDrawer
          menuItems={menuItems}
          defaultDrawerState={"half-open"}
        />
      )}
      <Box flex={1} overflowY="auto" px={[5, 5, 78]} py={5}>
        {children}
      </Box>
    </Flex>
  );
}
