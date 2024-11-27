"use client";

import React from "react";
import { ChevronLeft } from "@mui/icons-material";
import { Flex, useBreakpointValue } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();

  // Check if the current screen size is mobile
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Don't render the button if it's a mobile device
  if (isMobile) return null;

  return (
    <Flex
      as="button"
      onClick={() => router.back()}
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
      h={"full"}
      color={"white"}
      _hover={{
        color: "gray.300",
        transform: "translateX(-5px)",
      }}
      _active={{
        color: "gray.500",
      }}
      transition="all 0.2s ease-in-out"
    >
      <ChevronLeft fontSize="large" />
    </Flex>
  );
};

export default BackButton;
