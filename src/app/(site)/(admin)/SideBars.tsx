"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MenuItem } from "@/components/Sidebars/NavigationSidebar/NavigationSidebar";

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
  Dashboard,
  DashboardCustomize,
  BlurOn,
} from "@mui/icons-material";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/providers/UserProvider";
import { ManageTagsModal } from "@/components/modals/adminModals/ManageTagsModal";
import { useTags } from "@/providers/TagsProvider";
import { useBreakpointValue } from "@chakra-ui/react";
import NavigationSidebar from "@/components/Sidebars/NavigationSidebar/NavigationSidebar";
import NavigationBottombar from "@/components/Bottombar/NavigationBottombar/NavigationBottombar";

export default function SideBars() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const modalRef = useRef(null);
  const { recordIds } = useTags();
  const [leftMenuItems, setLeftMenuItems] = useState<MenuItem[]>([]);

  const { recordId, recordParentId, recordCustomerId } = recordIds || {};

  const generateLeftSidebarItemsDrawer = (
    userRole: string | undefined,
    isFree: boolean
  ) => {
    const items = [];

    if (userRole === "CA" && !isFree) {
      items.push(
        {
          label: "My Company",
          icon: <Domain sx={{ height: "100%", width: "100%" }} />,
          url: "/my-company",
          category: "Company",
        },
        {
          label: "Company Users",
          icon: <Person sx={{ height: "100%", width: "100%" }} />,
          url: "/users?userType=internal",
          category: "Company",
        },
        {
          label: "Company Sites",
          icon: <LocationOn sx={{ height: "100%", width: "100%" }} />,
          url: "/sites?siteType=internal",
          category: "Company",
        },
        {
          label: "Teams",
          icon: <People sx={{ height: "100%", width: "100%" }} />,
          url: "/teams",
          category: "Company",
        },
        {
          label: "User Groups",
          icon: <Groups sx={{ height: "100%", width: "100%" }} />,
          url: "/user-groups",
          category: "Company",
        },
        {
          label: "Tags",
          icon: <Sell sx={{ height: "100%", width: "100%" }} />,
          url: "/tags",
          category: "Company",
        },
        {
          label: "Email Schedules",
          icon: <ScheduleSend sx={{ height: "100%", width: "100%" }} />,
          url: "/email-schedule",
          category: "Company",
        },
        {
          label: "Our Clients",
          icon: <Domain sx={{ height: "100%", width: "100%" }} />,
          url: "/customers?customerType=external",
          category: "Clients",
        },
        {
          label: "Clients Users",
          icon: <Person sx={{ height: "100%", width: "100%" }} />,
          url: "/users?userType=external",
          category: "Clients",
        },
        {
          label: "Clients Sites",
          icon: <LocationOn sx={{ height: "100%", width: "100%" }} />,
          url: "/sites?siteType=external",
          category: "Clients",
        }
      );
    } else if (userRole === "PA") {
      items.push(
        {
          label: "Customers",
          icon: <Domain sx={{ height: "100%", width: "100%" }} />,
          url: "/customers",
          category: "Platform",
        },
        {
          label: "Users",
          icon: <Person sx={{ height: "100%", width: "100%" }} />,
          url: "/users",
          category: "Platform",
        },
        {
          label: "Sites",
          icon: <LocationOn sx={{ height: "100%", width: "100%" }} />,
          url: "/sites",
          category: "Platform",
        },
        {
          label: "User Groups",
          icon: <Groups sx={{ height: "100%", width: "100%" }} />,
          url: "/user-groups",
          category: "Platform",
        },
        {
          label: "Tags",
          icon: <Sell sx={{ height: "100%", width: "100%" }} />,
          url: "/tags",
          category: "Platform",
        },
        {
          label: "Option Lists",
          icon: <FormatListNumbered sx={{ height: "100%", width: "100%" }} />,
          url: "/option-lists",
          category: "Platform",
        },
        {
          label: "Select Items",
          icon: <Checklist sx={{ height: "100%", width: "100%" }} />,
          url: "/select-items",
          category: "Platform",
        },
        {
          label: "Tool Subscriptions",
          icon: <ShoppingCartCheckout sx={{ height: "100%", width: "100%" }} />,
          url: "/tool-subscriptions",
          category: "Workflows",
        },
        {
          label: "Tool",
          icon: <Construction sx={{ height: "100%", width: "100%" }} />,
          url: "/tools",
          category: "Workflows",
        },
        {
          label: "Workflow",
          icon: <AccountTree sx={{ height: "100%", width: "100%" }} />,
          url: "/workflows",
          category: "Workflows",
        },
        {
          label: "Business Process",
          icon: <Schema sx={{ height: "100%", width: "100%" }} />,
          url: "/business-processes",
          category: "Workflows",
        },
        {
          label: "Forms",
          icon: <FormatAlignCenter sx={{ height: "100%", width: "100%" }} />,
          url: "/forms",
          category: "Workflows",
        },
        {
          label: "Dashboards",
          icon: <Dashboard sx={{ height: "100%", width: "100%" }} />,
          url: "/dashboards",
          category: "Dashboards",
        },
        {
          label: "Dashboard Workflows",
          icon: <DashboardCustomize sx={{ height: "100%", width: "100%" }} />,
          url: "/dashboard-workflows",
          category: "Dashboards",
        },
        {
          label: "Email Templates",
          icon: <Email sx={{ height: "100%", width: "100%" }} />,
          url: "/email-template",
          category: "Emails",
        },
        {
          label: "Email Schedules",
          icon: <ScheduleSend sx={{ height: "100%", width: "100%" }} />,
          url: "/email-schedule",
          category: "Emails",
        },
        {
          label: "Email Links",
          icon: <MailLock sx={{ height: "100%", width: "100%" }} />,
          url: "/email-secure-link",
          category: "Emails",
        },
        {
          label: "Form Builder",
          icon: <AddReaction sx={{ height: "100%", width: "100%" }} />,
          url: "/survey-test",
          category: "Test",
        },
        {
          label: "Drag Grids Test",
          icon: <Grid4x4 sx={{ height: "100%", width: "100%" }} />,
          url: "/grid-test",
          category: "Test",
        }
      );
    } else if (isFree && userRole === "CA") {
      items.push(
        {
          label: "My Company",
          icon: <Domain sx={{ height: "100%", width: "100%" }} />,
          url: "/my-company",
          category: "Company",
        },
        {
          label: "Company Users",
          icon: <Person sx={{ height: "100%", width: "100%" }} />,
          url: "/users?userType=internal",
          category: "Company",
        },
        {
          label: "Company Sites",
          icon: <LocationOn sx={{ height: "100%", width: "100%" }} />,
          url: "/sites?siteType=internal",
          category: "Company",
        },
        {
          label: "Teams",
          icon: <People sx={{ height: "100%", width: "100%" }} />,
          url: "/teams",
          category: "Company",
        },
        {
          label: "User Groups",
          icon: <Groups sx={{ height: "100%", width: "100%" }} />,
          url: "/user-groups",
          category: "Company",
          locked: true,
        },
        {
          label: "Tags",
          icon: <Sell sx={{ height: "100%", width: "100%" }} />,
          url: "/tags",
          category: "Company",
          locked: true,
        },
        {
          label: "Email Schedules",
          icon: <ScheduleSend sx={{ height: "100%", width: "100%" }} />,
          url: "/email-schedule",
          category: "Company",
          locked: true,
        },
        {
          label: "Our Clients",
          icon: <Domain sx={{ height: "100%", width: "100%" }} />,
          url: "/customers?customerType=external",
          category: "Clients",
          locked: true,
        },
        {
          label: "Clients Users",
          icon: <Person sx={{ height: "100%", width: "100%" }} />,
          url: "/users?userType=external",
          category: "Clients",
          locked: true,
        },
        {
          label: "Clients Sites",
          icon: <LocationOn sx={{ height: "100%", width: "100%" }} />,
          url: "/sites?siteType=external",
          category: "Clients",
          locked: true,
        }
      );
    } else if (isFree && userRole === "CU") {
      items.push(
        {
          label: "Our Staff",
          icon: <Person sx={{ height: "100%", width: "100%" }} />,
          url: "/users",
          category: "My Company",
        },
        {
          label: "Our Sites",
          icon: <LocationOn sx={{ height: "100%", width: "100%" }} />,
          url: "/sites",
          category: "My Company",
        },
        {
          label: "Teams",
          icon: <People sx={{ height: "100%", width: "100%" }} />,
          url: "/teams",
          category: "My Company",
        },
        {
          label: "Our Clients",
          icon: <Domain sx={{ height: "100%", width: "100%" }} />,
          url: "/customers?customerType=external",
          category: "Clients",
          locked: true,
        }
      );
    } else if (!isFree && userRole === "CU") {
      items.push(
        {
          label: "Our Staff",
          icon: <Person sx={{ height: "100%", width: "100%" }} />,
          url: "/users",
          category: "My Company",
        },
        {
          label: "Our Sites",
          icon: <LocationOn sx={{ height: "100%", width: "100%" }} />,
          url: "/sites",
          category: "My Company",
        },
        {
          label: "Teams",
          icon: <People sx={{ height: "100%", width: "100%" }} />,
          url: "/teams",
          category: "My Company",
        },
        {
          label: "Our Clients",
          icon: <Domain sx={{ height: "100%", width: "100%" }} />,
          url: "/customers?customerType=external",
          category: "Clients",
        }
      );
    } else if (isFree && userRole === "CS") {
      items.push(
        {
          label: "Our Staff",
          icon: <Person sx={{ height: "100%", width: "100%" }} />,
          url: "/users",
          category: "My Company",
        },
        {
          label: "Our Sites",
          icon: <LocationOn sx={{ height: "100%", width: "100%" }} />,
          url: "/sites",
          category: "My Company",
        },
        {
          label: "Teams",
          icon: <People sx={{ height: "100%", width: "100%" }} />,
          url: "/teams",
          category: "My Company",
        },
        {
          label: "Our Clients",
          icon: <Domain sx={{ height: "100%", width: "100%" }} />,
          url: "/customers?customerType=external",
          category: "Clients",
          locked: true,
        }
      );
    } else if (!isFree && userRole === "CS") {
      items.push(
        {
          label: "Our Staff",
          icon: <Person sx={{ height: "100%", width: "100%" }} />,
          url: "/users",
          category: "My Company",
        },
        {
          label: "Our Sites",
          icon: <LocationOn sx={{ height: "100%", width: "100%" }} />,
          url: "/sites",
          category: "My Company",
        },
        {
          label: "Teams",
          icon: <People sx={{ height: "100%", width: "100%" }} />,
          url: "/teams",
          category: "My Company",
        },
        {
          label: "Our Clients",
          icon: <Domain sx={{ height: "100%", width: "100%" }} />,
          url: "/customers?customerType=external",
          category: "Clients",
        }
      );
    } else if (isFree && userRole === "CL") {
      items.push(
        {
          label: "Our Staff",
          icon: <Person sx={{ height: "100%", width: "100%" }} />,
          url: "/users",
          category: "My Company",
        },
        {
          label: "Sites",
          icon: <LocationOn sx={{ height: "100%", width: "100%" }} />,
          url: "/sites",
          category: "My Company",
        },
        {
          label: "Teams",
          icon: <People sx={{ height: "100%", width: "100%" }} />,
          url: "/teams",
          category: "My Company",
        },
        {
          label: "Our Clients",
          icon: <Domain sx={{ height: "100%", width: "100%" }} />,
          url: "/customers?customerType=external",
          category: "Clients",
          locked: true,
        }
      );
    } else if (!isFree && userRole === "CL") {
      items.push(
        {
          label: "Our Staff",
          icon: <Person sx={{ height: "100%", width: "100%" }} />,
          url: "/users",
          category: "My Company",
        },
        {
          label: "Sites",
          icon: <LocationOn sx={{ height: "100%", width: "100%" }} />,
          url: "/sites",
          category: "My Company",
        },
        {
          label: "Teams",
          icon: <People sx={{ height: "100%", width: "100%" }} />,
          url: "/teams",
          category: "My Company",
        },
        {
          label: "Our Clients",
          icon: <Domain sx={{ height: "100%", width: "100%" }} />,
          url: "/customers?customerType=external",
          category: "Clients",
        }
      );
    }

    return items.map(({ url, ...item }) => ({
      ...item,
      onClick: () => router.push(url),
      active:
        url ===
        pathname +
          (searchParams.toString() ? `?${searchParams.toString()}` : ""),
    }));
  };


  useEffect(() => {
    const newItems = generateLeftSidebarItemsDrawer(
      user?.role,
      user?.customerIsFree ?? true
    );

    const hasAnyActive = newItems.some((item) => item.active);

    if (leftMenuItems.length === 0) {
      setLeftMenuItems(newItems);
    }

    if (hasAnyActive) {
      setLeftMenuItems(newItems);
    }
  }, [user?.role, pathname]);

  /**
   * Determines if we should show right-hand "Add / Remove Tags".
   */
  const generateRightSidebarItemsDrawer = useMemo(() => {
    let entityType = null;

    // Basic entity match
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

    // If the user is free, disable tags
    if (user?.customerIsFree) {
      shouldShowManageTags = false;
    }

    return shouldShowManageTags
      ? [
          {
            label: "Add / Remove Tags",
            icon: <Sell sx={{ height: "100%", width: "100%" }} />,
            onClick: () =>
              // @ts-ignore
              modalRef.current?.openModal(),
          },
        ]
      : [];
  }, [
    pathname,
    user?.role,
    user?.userId,
    user?.customerId,
    recordId,
    recordCustomerId,
    recordParentId,
  ]);

  const rightMenuItems = generateRightSidebarItemsDrawer;

  let modalCustomerId = user?.customerId || 0;

  // Default drawer state for right-hand panel
  const rightDrawerDefaultState =
    useBreakpointValue({
      base: "closed",
      md: "half-open",
    } as const) ?? "closed";

  return (
    <>
      {!["/my-profile", "/activity", "/client-activity"].includes(pathname) && (
        <NavigationSidebar
          menuItems={leftMenuItems}
          drawerState={"half-open"}
          side={"left"}
        />
      )}
      <NavigationBottombar menuItems={leftMenuItems} />
      {rightMenuItems.length > 0 && (
        <NavigationSidebar
          menuItems={rightMenuItems}
          side={"right"}
          openButtonIcon={BlurOn}
          drawerState={rightDrawerDefaultState}
        />
      )}
      <ManageTagsModal ref={modalRef} customerId={modalCustomerId} />
    </>
  );
}
