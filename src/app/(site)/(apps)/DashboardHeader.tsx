"use client";

import {Box, Flex, Heading} from "@chakra-ui/react";
import AddButton from "@/components/Buttons/AddButton";
import {useWorkflow} from "@/providers/WorkflowProvider";
import BackButton from "@/components/BackButton";

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
    const {toolId, workflowId} = useWorkflow();

    const ableToStartWorkflow = toolId && workflowId && canStartWorkflow;

    return (
        <Flex
            align="center"
            justify="flex-start"
            w="full"
            gap={4}
            lineHeight={0}
        >
            <BackButton prevRoute={'/'}/>

            {/* Heading */}
            <Heading
                as="h1"
                fontWeight={100}
                color="white"
                fontSize={{base: "2xl", md: "4xl"}}
                fontFamily="Bonfire"
                textAlign="center"
                mt={2}
            >
                {headingText}
            </Heading>

            {/* AddButton */}
            {ableToStartWorkflow && (
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
