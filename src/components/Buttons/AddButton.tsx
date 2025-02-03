import React from "react";
import {Text, Button, useBreakpointValue} from "@chakra-ui/react";
import {Add} from "@mui/icons-material";
import {useFetchClient} from "@/hooks/useFetchClient";
import {useRouter} from "next/navigation";

interface AddButtonProps {
    label: string;
    toolId: string;
    workflowId: string;
    redirectUrl: string;
    onAddButtonClick?: () => void;
    AddIcon?: React.FC<any>;
    workflow?: boolean;
}

interface WorkflowInstanceResponse {
    new_wfinstid: string;
}

const AddButton: React.FC<AddButtonProps> = ({
                                                 label,
                                                 toolId,
                                                 workflowId,
                                                 redirectUrl,
                                                 onAddButtonClick,
                                                 AddIcon,
                                                 workflow = true
                                             }) => {
    const isMobile = useBreakpointValue({base: true, sm: true, md: false});
    const {fetchClient, loading} = useFetchClient();
    const router = useRouter();

    const addIconStyle = isMobile ? undefined : {marginRight: "8px"};


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
            position={isMobile ? "fixed" : "relative"}
            bottom={isMobile ? (!workflow ? ["10px", "45px"] : "110px") : undefined}
            right={isMobile ? "12px" : undefined}
            onClick={onAddButtonClick ? onAddButtonClick : handleClick}
            backgroundColor="lightGreen"
            color="white"
            _hover={{backgroundColor: "seduloGreen"}}
            minW={"48px"}
            minH={"48px"}
            aspectRatio={isMobile ? 1 : undefined}
            borderRadius={isMobile ? 'full' : 'md'}
            isLoading={loading}
            zIndex={isMobile ? 20 : undefined}
        >

            {AddIcon ? <AddIcon style={addIconStyle}/> : <Add style={addIconStyle}/>}
            {!isMobile && <Text fontSize={"md"}>{label}</Text>}
        </Button>
    );
};

export default AddButton;
