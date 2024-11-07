import { ReactNode } from "react";

import { Box, Flex } from "@chakra-ui/react";

import { ManageTagsModal } from "@/components/modals/adminModals/ManageTagsModal";
import { TagsProvider } from "@/providers/TagsProvider";
import SideBars from "./SideBars";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Flex flex={1} width="100%" mt={"60px"} mb={"30px"}>
      <TagsProvider>
        <SideBars />
        <Box flex={1} overflowY="auto" px={[5, 5, 78]} py={5}>
          {children}
        </Box>
      </TagsProvider>
    </Flex>
  );
}
