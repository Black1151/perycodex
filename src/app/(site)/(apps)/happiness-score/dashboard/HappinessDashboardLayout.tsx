"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LeftHandNavigationDrawer } from "@/components/layout/LeftHandNavigationDrawer";
import { Analytics } from "@mui/icons-material";

interface DashboardItem {
  dashboardId: number;
  dashboardName: string;
  workflowId: number;
  userRole: string;
  userAccessGroupNames: string | null;
  dashboardUrl: string;
  smallIconImageUrl: string | null;
  largeIconImageUrl: string | null;
  dashboardOrder: number;
  availableAs: string;
}

interface HappinessDashboardLayoutProps {
  dashboardList: DashboardItem[];
}

const HappinessDashboardLayout: React.FC<HappinessDashboardLayoutProps> = ({
  dashboardList,
}) => {
  const router = useRouter();

  console.log(dashboardList);

  const menuItems = dashboardList.map((dashboard) => ({
    label: dashboard.dashboardName,
    icon: <Analytics sx={{ height: "100%", width: "100%" }} />,
    onClick: () => router.push(dashboard.dashboardUrl),
    category: "Dashboard",
  }));

  return (
    <>
      <LeftHandNavigationDrawer
        menuItems={menuItems}
        defaultDrawerState={"half-open"}
      />
    </>
  );
};

export default HappinessDashboardLayout;
