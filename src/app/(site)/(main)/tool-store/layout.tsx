import { ReactNode } from "react";
import { Box, Flex } from "@chakra-ui/react";
import PerygonPageContainer from "@/components/layout/PerygonPageContainer";

interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  return (
    <>
      <Flex flex={1} width="100%" mt={"70px"} mb={["60px", "60px", "35px"]} align={"center"} justify="center" px={["2", "2", "4"]}>
          {children}
      </Flex>
    </>
  );
}
