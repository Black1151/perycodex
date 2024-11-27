"use client";

import { Box, Flex, Heading } from "@chakra-ui/react";
import AddButton from "@/components/Buttons/AddButton";
import { useWorkflow } from "@/providers/WorkflowProvider";
import BackButton from "@/components/BackButton";

interface WorkflowHeaderProps {
  headingText: string;
  canStartWorkflow: boolean;
}

const WorkflowHeader: React.FC<WorkflowHeaderProps> = ({
  headingText,
  canStartWorkflow,
}) => {
  const { toolId, workflowId } = useWorkflow();

  const ableToStartWorkflow = toolId && workflowId && canStartWorkflow;

  return (
    <Flex align={"flex-start"} w={"full"} gap={2}>
      <BackButton />
      <Heading
        as="h1"
        fontWeight={100}
        color="white"
        size={["lg", "xl"]}
        fontFamily="Bonfire"
      >
        {headingText}
      </Heading>
      {ableToStartWorkflow && (
        <Box ml={"auto"}>
          <AddButton
            label="Create New"
            toolId={toolId}
            workflowId={workflowId}
            redirectUrl="/happiness-score"
          />
        </Box>
      )}
    </Flex>
  );
};

export default WorkflowHeader;
