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
    <Flex
      align={"center"}
      justify={"flex-start"}
      w={["85%", "85%", "full"]}
      gap={4}
      lineHeight={0}
      mb={4}
    >
      <BackButton />

      {/* Heading */}
      <Heading
        as="h1"
        fontWeight={100}
        color="white"
        size={["lg", "xl"]}
        fontFamily="Bonfire"
        textAlign="center"
      >
        {headingText}
      </Heading>

      {/* AddButton */}
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
