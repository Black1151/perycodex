"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Analytics,
  BarChart,
  BubbleChart,
  Insights,
  Timeline,
} from "@mui/icons-material";
import { useWorkflow } from "@/providers/WorkflowProvider";
import { LeftHandNavigationDrawer } from "@/components/layout/LeftHandNavigationDrawer";
import BottomNavigationMenu from "@/components/layout/BottomNavigationMenu";
import { Dashboard } from "@/lib/dashboardUtils";

interface HappinessDashboardLayoutProps {
  dashboardList: Dashboard[];
}

// Icon Mapper
const iconMapper: Record<string, React.ReactElement> = {
  analytics: <Analytics sx={{ height: "100%", width: "100%" }} />,
  insights: <Insights sx={{ height: "100%", width: "100%" }} />,
  timeline: <Timeline sx={{ height: "100%", width: "100%" }} />,
  bubble: <BubbleChart sx={{ height: "100%", width: "100%" }} />,
  default: <BarChart sx={{ height: "100%", width: "100%" }} />, // Default icon
};

const HappinessDashboardLayout: React.FC<HappinessDashboardLayoutProps> = ({
  dashboardList,
}) => {
  const router = useRouter();
  const { toolId, workflowId } = useWorkflow();

  // Generate menu items dynamically
  const menuItems = dashboardList.map((dashboard) => {
    const iconKey = dashboard.smallIconImageUrl || "default"; // Use 'default' if iconKey is missing
    const icon = iconMapper[iconKey] || iconMapper.default; // Select icon from mapper

    return {
      label: dashboard.dashboardName,
      icon,
      onClick: () =>
        router.push(
          `${dashboard.dashboardUrl}?toolId=${toolId}&wfId=${workflowId}`,
        ),
      category: "Dashboards",
    };
  });

  // Do not render the navigation components if there's only one item
  if (menuItems.length === 1) {
    return null; // Return nothing since navigation is handled automatically
  }

  return (
    <>
      <LeftHandNavigationDrawer
        menuItems={menuItems}
        defaultDrawerState={"half-open"}
      />
      <BottomNavigationMenu menuItems={menuItems} />
    </>
  );
};

export default HappinessDashboardLayout;
