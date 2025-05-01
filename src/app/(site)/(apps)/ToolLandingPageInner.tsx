"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { Flex } from "@chakra-ui/react";

interface ToolLandingPageProps {
  redirectUrl?: string | null;
  splashScreen?: ReactNode;
}

export const ToolLandingPage = ({
  redirectUrl,
  splashScreen,
}: ToolLandingPageProps) => {
  const router = useRouter();

  useEffect(() => {
    if (redirectUrl) {
      if (!splashScreen) {
        // Immediately redirect if no splash screen is provided
        router.push(redirectUrl);
        return;
      }
      // Set a timer for redirection if splash screen is provided
      const timer = setTimeout(() => {
        router.push(redirectUrl);
      }, 5000);

      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [redirectUrl, splashScreen, router]);

  // Render the splash screen if provided, otherwise render nothing
  return splashScreen ? (
    <Flex height={"100%"} justify={"center"} align={"center"}>
      {splashScreen}
    </Flex>
  ) : null;
};
