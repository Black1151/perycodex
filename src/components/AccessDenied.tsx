"use client";

import { useRouter } from "next/navigation";
import ErrorBox from "@/components/layout/ErrorBox";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { Box } from "@chakra-ui/react";

export default function AccessDenied() {
  const router = useRouter();
  const supportingText = `You do not have permission to access this tool or workflow. If you believe this is an error, please contact your administrator.`;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      w="100vw"
      h="100vh"
      zIndex="9999"
      overflow="hidden"
    >
      <ErrorBox
        supportingText={supportingText}
        buttonText="Go to homepage"
        onButtonClick={() => router.push("/")}
      />
    </Box>
  );
}
