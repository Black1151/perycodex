'use client';

import React from 'react';
import {Box, Flex, FormControl, Heading, Text, VStack, Tag, Tooltip} from '@chakra-ui/react';
import moment from 'moment';
import CreateIcon from '@mui/icons-material/Create';
import UpdateIcon from '@mui/icons-material/Update';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface BusinessProcess {
    id: number;
    name: string;
    description: string;
    userAccessGroupNames: string[] | null;
    allowAlwaysEdit: boolean;
    allowBpStartersViewAll: boolean;
    allowElevatedViewAll: boolean;
    startByDefault: boolean;
    bpStartTriggerGv: string | null;
    bpStartTriggerOperator: string | null;
    bpStartTriggerValue: string | null;
    startDate: string | null;
    noOfDaysLiveAfterBpStart: number | null;
    noOfDaysLiveAfterWfStart: number | null;
    caCanUpdateDurationParams: boolean | null;
    globalVariables: string[] | null;
    notificationTriggers: string[] | null;
    formId: number;
    contributorFunctionality: boolean;
    contributorReason: string | null;
    minRequired: number;
    maxRequired: number;
    altContributorTerm: string | null;
    saveAllowed: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    updatedBy: number;
    smallIconImageUrl: string | null;
    largeIconImageUrl: string | null;
}

interface BusinessProcessDetailsBannerProps {
    businessProcess: BusinessProcess;
}

export const BusinessProcessDetailsBanner: React.FC<BusinessProcessDetailsBannerProps> = ({businessProcess}) => {
    return (
        <Flex mb={4} p={4} bg="gray.700" color="white" borderRadius="md" boxShadow="md" overflow="hidden">
            {/* Business Process Status */}
            <FormControl w="100px" h="100px" aspectRatio={1} borderRadius="full" mr={4}>
                <Box
                    position="relative"
                    w="100px"
                    h="100px"
                    borderRadius="full"
                    bg={businessProcess.isActive ? "green.500" : "red.500"}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Tooltip title={businessProcess.isActive ? "Active Business Process" : "Inactive Business Process"}>
                        {businessProcess.isActive ? (
                            <CheckCircleIcon style={{fontSize: '48px', color: 'white'}}/>
                        ) : (
                            <ErrorOutlineIcon style={{fontSize: '48px', color: 'white'}}/>
                        )}
                    </Tooltip>
                </Box>
            </FormControl>

            {/* Business Process Information */}
            <VStack align="start" spacing={3} flex="1">
                <Heading fontWeight={500} size="lg">
                    {businessProcess.name}
                </Heading>
                <Text fontSize="sm">{businessProcess.description}</Text>

                {/* Business Process Metadata */}
                <Flex align="center" justify="start" wrap="wrap" gap={4}>
                    {businessProcess.allowAlwaysEdit && (
                        <Tag colorScheme="blue">Always Editable</Tag>
                    )}
                    {businessProcess.allowBpStartersViewAll && (
                        <Tag colorScheme="green">BP Starters Can View All</Tag>
                    )}
                    {businessProcess.allowElevatedViewAll && (
                        <Tag colorScheme="purple">Elevated Users Can View All</Tag>
                    )}
                    {businessProcess.startByDefault && (
                        <Tag colorScheme="yellow">Starts by Default</Tag>
                    )}
                    <Text fontSize="sm">
                        {businessProcess.startDate
                            ? `Start Date: ${moment(businessProcess.startDate).format('D MMM YYYY')}`
                            : "Start Date: N/A"}
                    </Text>
                    {businessProcess.noOfDaysLiveAfterBpStart !== null && (
                        <Text fontSize="sm">Live for {businessProcess.noOfDaysLiveAfterBpStart} Days after BP
                            Start</Text>
                    )}
                    {businessProcess.noOfDaysLiveAfterWfStart !== null && (
                        <Text fontSize="sm">Live for {businessProcess.noOfDaysLiveAfterWfStart} Days after WF
                            Start</Text>
                    )}
                </Flex>
            </VStack>

            {/* Metadata Information */}
            <VStack ml="auto" alignItems="end" justifyContent="flex-start" display={['none', 'none', 'flex']}>
                <Heading size="lg" fontWeight={100}>ID: {businessProcess.id}</Heading>
                <Flex direction="row" justify="center" align="center" gap={2}>
                    <CreateIcon/>
                    <Text fontSize="sm">{moment(businessProcess.createdAt).format('D/MM/YYYY')}</Text>
                </Flex>
                <Flex direction="row" justify="center" align="center" gap={2}>
                    <UpdateIcon/>
                    <Text fontSize="sm">{moment(businessProcess.updatedAt).format('D/MM/YYYY')}</Text>
                </Flex>
            </VStack>
        </Flex>
    );
};
