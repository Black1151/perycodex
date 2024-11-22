import { ReactNode } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { DashboardFilteringDrawer } from "@/components/layout/DashboardFilteringDrawer";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Flex flex={1} width="100%" mt={"60px"} mb={["60px", null, "30px"]}>
      <Box flex={1} overflowY="auto" px={[3, 3, 78]} py={5}>
        {children}
      </Box>
    </Flex>
  );
}
