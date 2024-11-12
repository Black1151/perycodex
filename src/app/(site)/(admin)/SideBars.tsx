"use client";

import { useEffect, useMemo, useRef } from "react";
import { LeftHandNavigationDrawer } from "@/components/layout/LeftHandNavigationDrawer";

import {
  AccountTree,
  AddReaction,
  Checklist,
  Construction,
  Domain,
  Email,
  FormatAlignCenter,
  FormatListNumbered,
  Grid4x4,
  Groups,
  LocationOn,
  MailLock,
  People,
  Person,
  ScheduleSend,
  Schema,
  Sell,
  ShoppingCartCheckout,
} from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/providers/UserProvider";
import BottomNavigationMenu from "@/components/layout/BottomNavigationMenu";
import { RightHandNavigationDrawer } from "@/components/layout/RightHandNavigationDrawer";
import { ManageTagsModal } from "@/components/modals/adminModals/ManageTagsModal";
import { useTags } from "@/providers/TagsProvider";
import { useBreakpointValue } from "@chakra-ui/react";

export default function SideBars() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const modalRef = useRef(null);
  const { recordIds } = useTags();

  const { recordId, recordParentId, recordCustomerId } = recordIds || {};

  useEffect(() => {
    console.log("recordId", recordId);
    console.log("recordCustomerId", recordCustomerId);
    console.log("recordParentId", recordParentId);
    console.log("recordIds", recordIds);
    console.log("user ID ", user?.userId);
  }, [recordIds, user]);

  const generateLeftSidebarItemsDrawer = useMemo(
    () => (userRole: string | undefined) => {
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
            label: "Email Schedules",
            icon: <ScheduleSend sx={{ height: "100%", width: "100%" }} />,
            onClick: () => router.push("/email-schedule"),
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
            icon: (
              <ShoppingCartCheckout sx={{ height: "100%", width: "100%" }} />
            ),
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
            label: "Email Templates",
            icon: <Email sx={{ height: "100%", width: "100%" }} />,
            onClick: () => router.push("/email-template"),
            category: "Emails",
          },
          {
            label: "Email Schedules",
            icon: <ScheduleSend sx={{ height: "100%", width: "100%" }} />,
            onClick: () => router.push("/email-schedule"),
            category: "Emails",
          },
          {
            label: "Email Links",
            icon: <MailLock sx={{ height: "100%", width: "100%" }} />,
            onClick: () => router.push("/email-secure-link"),
            category: "Emails",
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
    },
    [router],
  );

  const generateRightSidebarItemsDrawer = useMemo(() => {
    let entityType = null;

    const match = pathname.match(/^\/(customers|users|sites)\/([^\/]+)$/);
    if (match) {
      entityType = match[1];
    }

    let shouldShowManageTags = false;

    // Skip all logic if user role is PA
    if (user?.role !== "PA") {
      if (pathname === "/my-profile") {
        // All users except PA can manage tags on their own User record
        shouldShowManageTags = true;
      } else if (user?.role === "CA" && pathname === `/my-company`) {
        // CA users can manage tags on their own Company record
        shouldShowManageTags = true;
      } else if (entityType && recordId) {
        if (entityType === "users" && recordId === String(user?.userId)) {
          // User is viewing their own User record in admin
          shouldShowManageTags = true;
        } else if (
          (user?.role === "CA" &&
            recordCustomerId == String(user?.customerId)) ||
          (user?.role === "CA" && recordParentId == String(user.customerId))
        ) {
          // CA can edit their own customer's sites
          shouldShowManageTags = true;
        }
      }
    }

    return shouldShowManageTags
      ? [
          {
            label: "Add / Remove Tags",
            icon: <Sell sx={{ height: "100%", width: "100%" }} />,
            // @ts-ignore
            onClick: () => modalRef.current?.openModal(),
            category: "Platform",
          },
        ]
      : [];
  }, [pathname, user?.role, user?.userId, user?.customerId, recordIds]);

  const leftMenuItems = useMemo(
    () => generateLeftSidebarItemsDrawer(user?.role || ""),
    [user?.role],
  );

  const rightMenuItems = generateRightSidebarItemsDrawer;

  let modalCustomerId = user?.customerId || 0;

  const rightDrawerDefaultState = useBreakpointValue({
    base: "closed",
    md: "half-open",
  } as const);

  return (
    <>
      {!["/my-profile", "/my-company"].includes(pathname) && (
        <LeftHandNavigationDrawer
          menuItems={leftMenuItems}
          defaultDrawerState={"half-open"}
        />
      )}
      <BottomNavigationMenu menuItems={leftMenuItems} />
      {rightMenuItems.length > 0 && (
        <RightHandNavigationDrawer
          menuItems={rightMenuItems}
          defaultDrawerState={rightDrawerDefaultState}
        />
      )}
      <ManageTagsModal ref={modalRef} customerId={modalCustomerId} />
    </>
  );
}
