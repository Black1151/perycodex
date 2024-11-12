import React from "react";
import { Box, Button, useBreakpointValue } from "@chakra-ui/react";
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
  const showLabel = useBreakpointValue({ base: false, sm: true });
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
      p={showLabel ? undefined : 0}
      minW={showLabel ? undefined : "40px"}
      h={showLabel ? undefined : "40px"}
      isLoading={loading}
    >
      {showLabel ? (
        <>
          <AddIcon style={{ marginRight: "8px" }} />
          {label}
        </>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          w="100%"
          h="100%"
        >
          <AddIcon />
        </Box>
      )}
    </Button>
  );
};

export default AddButton;
