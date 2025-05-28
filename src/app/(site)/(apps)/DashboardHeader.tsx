"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Flex,
  Heading,
  useTheme,
  useBreakpointValue,
  IconButton,
  Button,
  Text,
  HStack,
} from "@chakra-ui/react";
import AddButtonMobile from "@/components/Buttons/AddButtonMobile";
import { useWorkflow } from "@/providers/WorkflowProvider";
import BackButton from "@/components/BackButton";
import { useFetchClient } from "@/hooks/useFetchClient";
import { useRouter } from "next/navigation";
import AddButtonDesktop from "@/components/Buttons/AddButtonDesktop";
import { Help, Info } from "@mui/icons-material";

interface DashboardHeaderProps {
  headingText: string;
  canStartWorkflow: boolean;
  toolUrl: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  headingText,
  canStartWorkflow,
  toolUrl,
}) => {
  const { toolId, workflowId } = useWorkflow();
  const [ableToStart, setAbleToStart] = useState(
    !!toolId && !!workflowId && canStartWorkflow
  );

  // Chakra hook to detect mobile vs desktop
  const isMobile = useBreakpointValue({ base: true, sm: true, md: false });

  // Bring fetch + routing logic up here
  const { fetchClient, loading } = useFetchClient();
  const router = useRouter();

  const handleStartClick = useCallback(async () => {
    if (!toolId || !workflowId) return;
    try {
      const response = await fetchClient<{ new_wfinstid: string }>(
        "/api/workflows/startWorkflow",
        {
          method: "POST",
          body: {
            p_toolid: toolId,
            p_wfid: workflowId,
          },
          redirectOnError: false,
        }
      );
      if (response?.new_wfinstid) {
        router.push(`${toolUrl}/workflow/${response.new_wfinstid}`);
      }
    } catch (err) {
      console.error("Error starting workflow:", err);
    }
  }, [fetchClient, router, toolId, workflowId, toolUrl]);

  useEffect(() => {
    setAbleToStart(!!toolId && !!workflowId && canStartWorkflow);
  }, [toolId, workflowId, canStartWorkflow]);

  const theme = useTheme();

  return (
    <Flex align="center" justify="flex-start" w="full" gap={4} lineHeight={0}>
      <BackButton
        color={theme.fringeCases.dashboardHeader.textcolor}
        prevRoute="/"
      />

      <Heading
        as="h1"
        fontWeight={100}
        color={theme.fringeCases.dashboardHeader.textcolor}
        fontSize={{ base: "2xl", md: "4xl" }}
        fontFamily="Bonfire"
        textAlign="center"
        mt={2}
      >
        {headingText}
      </Heading>

      {ableToStart && (
        <Box ml="auto">
          {isMobile ? (
            <AddButtonMobile onAddButtonClick={handleStartClick} />
          ) : (
            <AddButtonDesktop
              label="Start"
              onAddButtonClick={handleStartClick}
            />
          )}
        </Box>
      )}
    </Flex>
  );
};

export default DashboardHeader;
