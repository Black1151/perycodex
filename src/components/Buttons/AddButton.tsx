import React from "react";
import { Text, Button, useBreakpointValue } from "@chakra-ui/react";
import AddIcon from "@mui/icons-material/Add";
import { useFetchClient } from "@/hooks/useFetchClient";
import { useRouter } from "next/navigation";

interface AddButtonProps {
  label: string;
  toolId: string;
  workflowId: string;
  redirectUrl: string;
}

interface WorkflowInstanceResponse {
  new_wfinstid: string;
}

const AddButton: React.FC<AddButtonProps> = ({
  label,
  toolId,
  workflowId,
  redirectUrl,
}) => {
  const isMobile = useBreakpointValue({ base: true, sm: true, md: false });
  const { fetchClient, loading } = useFetchClient();
  const router = useRouter();

  const handleClick = async () => {
    try {
      const response = await fetchClient<WorkflowInstanceResponse>(
        "/api/workflows/startWorkflow",
        {
          method: "POST",
          body: {
            p_toolid: toolId,
            p_wfid: workflowId,
          },
          redirectOnError: false,
        },
      );

      if (response && response.new_wfinstid) {
        router.push(`${redirectUrl}/workflow/${response.new_wfinstid}`);
      }
    } catch (error) {
      console.error("Error starting workflow:", error);
    }
  };

  return (
    <Button
      onClick={handleClick}
      backgroundColor="lightGreen"
      color="white"
      _hover={{ backgroundColor: "seduloGreen" }}
      minW={"40px"}
      h={"40px"}
      isLoading={loading}
    >
      <AddIcon style={{ marginRight: "8px" }} />
      <Text fontSize={isMobile ? "sm" : "md"}>{label}</Text>
    </Button>
  );
};

export default AddButton;
