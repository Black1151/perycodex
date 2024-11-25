import { ReactNode } from "react";
import { Box, Flex } from "@chakra-ui/react";
import apiClient from "@/lib/apiClient";
import HappinessDashboardLayout from "@/app/(site)/(apps)/happiness-score/dashboard/HappinessDashboardLayout";

interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const res = await apiClient(`/getAllView?view=vwWorkflowDashboardList`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    window.alert("HELP");
  }

  const dashboardData = (await res.json()).resource;

  return (
    <>
      <HappinessDashboardLayout dashboardList={dashboardData} />
      <Flex flex={1} width="100%" mt={"60px"} mb={["60px", null, "30px"]}>
        <Box flex={1} overflowY="auto" px={[3, 3, 78]} py={5}>
          {children}
        </Box>
      </Flex>
    </>
  );
}
