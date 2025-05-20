"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import NavigationSidebar, {
  MenuItem,
} from "@/components/Sidebars/NavigationSidebar/NavigationSidebar";
import NavigationBottombar from "@/components/Bottombar/NavigationBottombar/NavigationBottombar";
import { useBasket } from "./useBasket";
import StorefrontIcon from "@mui/icons-material/Storefront";
import BuildIcon from "@mui/icons-material/Build";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import GroupIcon from "@mui/icons-material/Group";
import { Business } from "@mui/icons-material";
import ListAltIcon from '@mui/icons-material/ListAlt';

const Sidebars: React.FC = () => {
  const { basket } = useBasket();
  const router = useRouter();
  const pathname = usePathname();

  const basketCount = basket?.content?.length ?? 0;

  const navItems = [
    { label: "Tool Store", icon: StorefrontIcon, href: "/tool-store" },
    {
      label: "Manage Subscription",
      icon: ShoppingCartIcon,
      href: "/tool-store/manage-subscription",
      badgeNumber: basketCount,
    },
    {
      label: "My Subscription",
      icon: ListAltIcon,
      href: "/tool-store/my-subscription",
    },
  ];

  const currentPath = pathname.replace(/\/$/, "");

  const menuItems: MenuItem[] = navItems.map((item) => ({
    label: item.label,
    icon: <item.icon sx={{ height: "100%", width: "100%" }} />,
    onClick: () => router.push(item.href),
    active: item.href.replace(/\/$/, "") === currentPath,
    badgeNumber: item.badgeNumber,
  }));

  return (
    <>
      <NavigationSidebar
        menuItems={menuItems}
        side="left"
        drawerState="half-open"
      />
      <NavigationBottombar menuItems={menuItems} />
    </>
  );
};

export default Sidebars;
