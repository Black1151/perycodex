'use client';

import React from 'react';
import {Button} from "@chakra-ui/react";
import {useFetchClient} from "@/hooks/useFetchClient";
import {useRouter} from "next/navigation";

// Define the props interface
interface CreateComponentProps {
    wfId?: string;  // optional string
    tId?: string;   // optional string
}

// Define the type for the response returned by the fetchClient
interface WorkflowInstanceResponse {
    new_wfinstid: string;
}

// Destructure wfId and tId from the props in the function component
const CreateComponent: React.FC<CreateComponentProps> = ({wfId, tId}) => {
    const {fetchClient, loading} = useFetchClient();
    const router = useRouter();

    const handleClick = async () => {
        try {
            const response = await fetchClient<WorkflowInstanceResponse>('/api/workflows/startWorkflow', {
                method: 'POST',
                body: {
                    p_wfid: wfId,
                    p_toolid: tId,
                },
                redirectOnError: false
            });

            if (response && response.new_wfinstid) {
                router.push(`/test-happiness-score-by-api/start?workflowInstanceId=${response.new_wfinstid}`);
            }
        } catch (error) {
            console.error("Error starting workflow:", error);
        }
    };

    return (
        <Button my={2} onClick={handleClick} isLoading={loading}>
            Start
        </Button>
    );
};

export default CreateComponent;
