"use client";

import { Box, Flex, Heading, theme, useTheme } from "@chakra-ui/react";
import AddButton from "@/components/Buttons/AddButton";
import { useWorkflow } from "@/providers/WorkflowProvider";
import BackButton from "@/components/BackButton";
import { useEffect, useState } from "react";

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
  const [ableToStart, setAbleToStart] = useState<boolean>(
    !!toolId && !!workflowId && canStartWorkflow
  );

  useEffect(() => {
    setAbleToStart(!!toolId && !!workflowId && canStartWorkflow);
  }, [toolId, workflowId, canStartWorkflow]);

  const theme = useTheme();

  return (
    <Flex align="center" justify="flex-start" w="full" gap={4} lineHeight={0}>
      <BackButton
        color={theme.fringeCases.dashboardHeader.textcolor}
        prevRoute={"/"}
      />

      {/* Heading */}
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

      {/* AddButton */}
      {ableToStart && toolId && workflowId && (
        <Box ml="auto">
          <AddButton
            label="Start"
            toolId={toolId}
            workflowId={workflowId}
            redirectUrl={toolUrl}
          />
        </Box>
      )}
    </Flex>
  );
};

export default DashboardHeader;
