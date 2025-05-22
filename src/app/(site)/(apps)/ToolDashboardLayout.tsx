"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import DashboardHeader from "@/app/(site)/(apps)/DashboardHeader";
import { Dashboard } from "@/lib/dashboardUtils";
import NavigationSidebar from "@/components/Sidebars/NavigationSidebar/NavigationSidebar";
import NavigationBottombar from "@/components/Bottombar/NavigationBottombar/NavigationBottombar";
import { getMuiIconByName } from "@/utils/muiIconMapper";
import { Icon } from "@chakra-ui/react";
import { useUser } from "@/providers/UserProvider";
import ToolGuideModal from "@/components/modals/toolGuideModal/ToolGuideModal";

interface DashboardAPIResponse {
  filteredDashboards: Dashboard[];
  toolData?: { startInUi: boolean };
}

interface ToolDashboardLayoutProps {
  toolUrl: string;
}

const ToolDashboardLayout: React.FC<ToolDashboardLayoutProps> = ({
  toolUrl,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { user } = useUser();
  const isFree = user?.customerIsFree ?? false;

  const toolId = searchParams.get("toolId");
  const workflowId = searchParams.get("wfId");

  const [dashboardList, setDashboardList] = useState<Dashboard[]>([]);
  const [activeDashboardName, setActiveDashboardName] = useState<string | null>(
    null,
  );
  const [toolData, setToolData] = useState<{ startInUi: boolean } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!toolId || !workflowId) return;

    const fetchDashboards = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/dashboards?toolId=${toolId}&workflowId=${workflowId}`,
        );
        if (!response.ok) throw new Error("Failed to fetch dashboards");

        const data: DashboardAPIResponse = await response.json();
        setDashboardList(data.filteredDashboards);
        setToolData(data.toolData || null);
      } catch (error) {
        console.error("Error fetching dashboards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboards();
  }, [toolId, workflowId]);

  useEffect(() => {
    const activeDashboard = dashboardList.find((dashboard) =>
      pathname.includes(dashboard.dashboardUrl),
    );
    setActiveDashboardName(
      activeDashboard ? activeDashboard.dashboardName : "Dashboard",
    );
  }, [pathname, dashboardList]);

  const menuItems = dashboardList.map((dashboard) => {
    const iconKey = dashboard.smallIconImageUrl || "BarChart";
    const icon = <Icon as={getMuiIconByName(iconKey)} />;

    return {
      label: dashboard.dashboardName,
      icon,
      onClick: () =>
        router.push(
          `${dashboard.dashboardUrl}?toolId=${toolId}&wfId=${workflowId}`,
        ),
      category: "Dashboards",
      active: pathname.includes(dashboard.dashboardUrl),
      locked: isFree ? dashboard.disableIfFree : false,
    };
  });

  if (menuItems.length === 1) {
    return (
      <DashboardHeader
        headingText={activeDashboardName ?? ""}
        canStartWorkflow={toolData?.startInUi ?? false}
        toolUrl={toolUrl}
      />
    );
  }

  return (
    <>
      <NavigationSidebar
        menuItems={menuItems}
        drawerState={"half-open"}
        side={"left"}
        loading={loading}
      />
      <NavigationBottombar menuItems={menuItems} />
      <DashboardHeader
        headingText={activeDashboardName ?? ""}
        canStartWorkflow={toolData?.startInUi ?? false}
        toolUrl={toolUrl}
      />
    </>
  );
};

export default ToolDashboardLayout;
