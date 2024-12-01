"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Analytics } from "@mui/icons-material";
import { useWorkflow } from "@/providers/WorkflowProvider";
import { LeftHandNavigationDrawer } from "@/components/layout/LeftHandNavigationDrawer";
import BottomNavigationMenu from "@/components/layout/BottomNavigationMenu";
import { Dashboard } from "@/lib/dashboardUtils";

interface HappinessDashboardLayoutProps {
  dashboardList: Dashboard[];
}

const HappinessDashboardLayout: React.FC<HappinessDashboardLayoutProps> = ({
  dashboardList,
}) => {
  const router = useRouter();
  const { toolId, workflowId } = useWorkflow();

  const menuItems = dashboardList.map((dashboard) => ({
    label: dashboard.dashboardName,
    icon: <Analytics sx={{ height: "100%", width: "100%" }} />,
    onClick: () =>
      router.push(
        `${dashboard.dashboardUrl}?toolId=${toolId}&wfId=${workflowId}`,
      ),
    category: "Dashboards",
  }));

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
