"use client"; // Mark this as a client component

import { ReactNode, useState } from "react";
import { LeftHandNavigationDrawer } from "@/components/layout/LeftHandNavigationDrawer";
import { Box, Flex } from "@chakra-ui/react";
import {
  AccountTree,
  AddReaction,
  Checklist,
  Construction,
  Domain,
  FormatAlignCenter,
  FormatListNumbered,
  Grid4x4,
  Groups,
  LocationOn,
  People,
  Person,
  Schema,
  Sell,
  ShoppingCartCheckout,
} from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/providers/UserProvider";
import BottomNavigationMenu from "@/components/layout/BottomNavigationMenu";
import { RightHandNavigationDrawer } from "@/components/layout/RightHandNavigationDrawer";
import { ManageTagsModal } from "@/components/modals/adminModals/ManageTagsModal";
import { TagsProvider } from "@/providers/TagsProvider";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const [isAddTagModalOpen, setIsAddTagModalOpen] = useState(false);

  const generateLeftSidebarItemsDrawer = (userRole: string | undefined) => {
    if (userRole === "CA") {
      return [
        {
          label: "My Company",
          icon: <Domain sx={{ height: "100%", width: "100%" }} />,
          onClick: () => router.push("/my-company"),
          category: "Internal",
        },
        {
          label: "Company Users",
          icon: <Person sx={{ height: "100%", width: "100%" }} />,
          onClick: () => router.push("/users?userType=internal"),
          category: "Internal",
        },
        {
          label: "Company Sites",
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
          label: "Clients Users",
          icon: <Person sx={{ height: "100%", width: "100%" }} />,
          onClick: () => router.push("/users?userType=external"),
          category: "External",
        },
        {
          label: "Clients Sites",
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
          label: "Tool Subscriptions",
          icon: <ShoppingCartCheckout sx={{ height: "100%", width: "100%" }} />,
          onClick: () => router.push("/tool-subscriptions"),
          category: "Workflows",
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
          label: "Form Builder",
          icon: <AddReaction sx={{ height: "100%", width: "100%" }} />,
          onClick: () => router.push("/survey-test"),
          category: "Test",
        },
        {
          label: "Drag Grids Test",
          icon: <Grid4x4 sx={{ height: "100%", width: "100%" }} />,
          onClick: () => router.push("/grid-test"),
          category: "Test",
        },
      ];
    }
    return [];
  };
  const generateRightSidebarItemsDrawer = (userRole: string | undefined) => {
    const isDynamicRoute = pathname.match(
      /^\/(customers|users|sites)\/[^\/]+$/
    );
    if (isDynamicRoute) {
      return [
        {
          label: "Manage Tags",
          icon: <Sell sx={{ height: "100%", width: "100%" }} />,
          onClick: () => setIsAddTagModalOpen(true),
          category: "Platform",
        },
        ...[],
      ];
    }
    return [];
  };

  const leftMenuItems = generateLeftSidebarItemsDrawer(user?.role);

  const rightMenuItems = generateRightSidebarItemsDrawer(user?.role);

  return (
    <Flex flex={1} width="100%" mt={"60px"} mb={"30px"}>
      {!["/my-profile", "/my-company"].includes(pathname) && (
        <>
          <LeftHandNavigationDrawer
            menuItems={leftMenuItems}
            defaultDrawerState={"half-open"}
          />
          <BottomNavigationMenu menuItems={leftMenuItems} />
          {rightMenuItems && rightMenuItems.length > 0 && (
            <RightHandNavigationDrawer
              menuItems={rightMenuItems}
              defaultDrawerState={"half-open"}
            />
          )}
        </>
      )}

      <TagsProvider>
        <ManageTagsModal
          isOpen={isAddTagModalOpen}
          setIsOpen={setIsAddTagModalOpen}
          customerId={user?.customerId || 0}
        />
        <Box flex={1} overflowY="auto" px={[5, 5, 78]} py={5}>
          {children}
        </Box>
      </TagsProvider>
    </Flex>
  );
}
