'use client';

import React from 'react';
import { Box, Flex, FormControl, Heading, Text, VStack, Tag, Tooltip } from '@chakra-ui/react';
import moment from 'moment';
import CreateIcon from '@mui/icons-material/Create';
import UpdateIcon from '@mui/icons-material/Update';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface Workflow {
    id: number;
    name: string;
    description: string;
    userAccessGroupNames: string[] | null;
    enableStartNewInUi: boolean;
    startDate: string | null;
    caCanUpdateStartDate: boolean;
    noOfDaysLiveAfterStart: number | null;
    caCanUpdateDuration: boolean;
    jsAdditionalFileUrl: string | null;
    cssThemeFileUrl: string | null;
    sjsThemeFileUrl: string | null;
    isActive: boolean;
    createdBy: number;
    updatedBy: number;
    createdAt: string;
    updatedAt: string;
}

interface WorkflowDetailsBannerProps {
    workflow: Workflow;
}

export const WorkflowDetailsBanner: React.FC<WorkflowDetailsBannerProps> = ({ workflow }) => {
    return (
        <Flex mb={4} p={4} bg="gray.700" color="white" borderRadius="md" boxShadow="md" overflow="hidden">
            {/* Workflow Status */}
            <FormControl w="100px" h="100px" aspectRatio={1} borderRadius="full" mr={4}>
                <Box
                    position="relative"
                    w="100px"
                    h="100px"
                    borderRadius="full"
                    bg={workflow.isActive ? "green.500" : "red.500"}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Tooltip title={workflow.isActive ? "Active Workflow" : "Inactive Workflow"}>
                        {workflow.isActive ? (
                            <CheckCircleIcon style={{ fontSize: '48px', color: 'white' }} />
                        ) : (
                            <ErrorOutlineIcon style={{ fontSize: '48px', color: 'white' }} />
                        )}
                    </Tooltip>
                </Box>
            </FormControl>

            {/* Workflow Information */}
            <VStack align="start" spacing={3} flex="1">
                <Heading fontWeight={500} size="lg">
                    {workflow.name}
                </Heading>
                <Text fontSize="sm">{workflow.description}</Text>

                {/* Workflow Metadata */}
                <Flex align="center" justify="start" wrap="wrap" gap={4}>
                    {workflow.enableStartNewInUi && (
                        <Tag colorScheme="green">Start New Enabled</Tag>
                    )}
                    {workflow.caCanUpdateStartDate && (
                        <Tag colorScheme="blue">Can Update Start Date</Tag>
                    )}
                    {workflow.caCanUpdateDuration && (
                        <Tag colorScheme="purple">Can Update Duration</Tag>
                    )}
                    <Text fontSize="sm">
                        {workflow.startDate
                            ? `Start Date: ${moment(workflow.startDate).format('D MMM YYYY')}`
                            : "Start Date: N/A"}
                    </Text>
                    {workflow.noOfDaysLiveAfterStart !== null && (
                        <Text fontSize="sm">Live for {workflow.noOfDaysLiveAfterStart} Days</Text>
                    )}
                </Flex>
            </VStack>

            {/* Metadata Information */}
            <VStack ml="auto" alignItems="end" justifyContent="flex-start" display={['none', 'none', 'flex']}>
                <Heading size="lg" fontWeight={100}>ID: {workflow.id}</Heading>
                <Flex direction="row" justify="center" align="center" gap={2}>
                    <CreateIcon />
                    <Text fontSize="sm">{moment(workflow.createdAt).format('D/MM/YYYY')}</Text>
                </Flex>
                <Flex direction="row" justify="center" align="center" gap={2}>
                    <UpdateIcon />
                    <Text fontSize="sm">{moment(workflow.updatedAt).format('D/MM/YYYY')}</Text>
                </Flex>
            </VStack>
        </Flex>
    );
};
