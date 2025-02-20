"use client";

import React, {useEffect, useState} from "react";
import {useRouter, useSearchParams, usePathname} from "next/navigation";
import {
    Analytics,
    BarChart,
    BubbleChart,
    Insights,
    Timeline,
} from "@mui/icons-material";
import {LeftHandNavigationDrawer} from "@/components/layout/LeftHandNavigationDrawer";
import BottomNavigationMenu from "@/components/layout/BottomNavigationMenu";
import DashboardHeader from "@/app/(site)/(apps)/DashboardHeader";
import {Dashboard} from "@/lib/dashboardUtils";
import NavigationSidebar from "@/components/Sidebar/NavigationSidebar";

interface DashboardAPIResponse {
    filteredDashboards: Dashboard[];
    toolData?: { startInUi: boolean };
}

const iconMapper: Record<string, React.ReactElement> = {
    analytics: <Analytics sx={{height: "100%", width: "100%"}}/>,
    insights: <Insights sx={{height: "100%", width: "100%"}}/>,
    timeline: <Timeline sx={{height: "100%", width: "100%"}}/>,
    bubble: <BubbleChart sx={{height: "100%", width: "100%"}}/>,
    default: <BarChart sx={{height: "100%", width: "100%"}}/>,
};

const ToolDashboardLayout: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const toolId = searchParams.get("toolId");
    const workflowId = searchParams.get("wfId");

    const [dashboardList, setDashboardList] = useState<Dashboard[]>([]);
    const [activeDashboardName, setActiveDashboardName] = useState<string | null>(null);
    const [toolData, setToolData] = useState<{ startInUi: boolean } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!toolId || !workflowId) return;

        const fetchDashboards = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `/api/dashboards?toolId=${toolId}&workflowId=${workflowId}`
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
            pathname.includes(dashboard.dashboardUrl)
        );
        setActiveDashboardName(activeDashboard ? activeDashboard.dashboardName : "Dashboard");
    }, [pathname, dashboardList])

    const menuItems = dashboardList.map((dashboard) => {
        const iconKey = dashboard.smallIconImageUrl || "default";
        const icon = iconMapper[iconKey] || iconMapper.default;

        return {
            label: dashboard.dashboardName,
            icon,
            onClick: () =>
                router.push(`${dashboard.dashboardUrl}?toolId=${toolId}&wfId=${workflowId}`),
            category: "Dashboards",
            active: pathname.includes(dashboard.dashboardUrl),
        };
    });

    if (menuItems.length === 1) {
        return null;
    }

    return (
        <>
            <NavigationSidebar menuItems={menuItems} initialState={"half-open"} side={'left'} loading={loading}/>
            <BottomNavigationMenu menuItems={menuItems}/>
            <DashboardHeader
                headingText={activeDashboardName ?? "My Company Happiness Stats"}
                canStartWorkflow={toolData?.startInUi ?? false}
                toolUrl={"/happiness-score"}
            />
        </>
    );
};

export default ToolDashboardLayout;
