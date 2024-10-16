'use client';

import React from 'react';
import {Box, Flex, FormControl, Heading, Text, VStack, Badge} from '@chakra-ui/react';
import {People} from "@mui/icons-material";
import moment from "moment/moment";
import CreateIcon from "@mui/icons-material/Create";
import UpdateIcon from "@mui/icons-material/Update"; // For fallback or general case icon

interface Team {
    id: number;
    name: string;
    description: string;
    customerId: number;
    managerId: number;
    parentTeamId: number | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    updatedBy: number;
    uniqueId: string;
    isDepartment: boolean;
}

interface UserTeamDetailsBannerProps {
    team: Team;
}

export const UserTeamDetailsBanner: React.FC<UserTeamDetailsBannerProps> = ({team}) => {
    // Determine if it's a department or team
    const isDepartment = team.parentTeamId === null;

    return (
        <Flex mb={4} p={4} color={'white'} overflow={'hidden'}>
            {/* Team/Department Icon and Name */}
            <FormControl w={'100px'} h={'100px'} aspectRatio={1} borderRadius={'full'}>
                <Box
                    position="relative"
                    w={'100px'}
                    h={'100px'}
                    borderRadius="full"
                    bg="gray.100"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <People fontSize="large" style={{fontSize: '48px', color: 'gray'}}/>
                </Box>
            </FormControl>

            {/* Team/Department Information */}
            <VStack align="start" ml={4} minW={'300px'} spacing={3}>
                <Flex alignItems="center">
                    <Heading fontWeight={300}>{team.name}</Heading>
                    <Box
                        ml={2}
                        w={4}
                        h={4}
                        borderRadius="full"
                        border={'white 1px solid'}
                        bg={team.isActive ? 'green.500' : 'red.500'}
                    />
                </Flex>

                {/* Department or Team Badge */}
                <Badge
                    colorScheme={isDepartment ? 'purple' : 'blue'}
                    variant="solid"
                    px={2}
                    py={1}
                    borderRadius="md"
                >
                    {isDepartment ? 'Department' : 'Team'}
                </Badge>
            </VStack>

            {/* Unique ID and Manager ID */}
            <VStack ml={'auto'} alignItems={'end'} justifyContent={'flex-start'} display={['none', 'none', 'flex']}>
                <Heading size="lg" fontWeight={100}>ID: {team.id}</Heading>
                <Flex direction={'row'} justify={'center'} align={'center'} gap={2}>
                    <CreateIcon/>
                    <Text fontSize="sm">{moment(team.createdAt).format('D/MM/YYYY')}</Text>
                </Flex>
                <Flex direction={'row'} justify={'center'} align={'center'} gap={2}>
                    <UpdateIcon/>
                    <Text fontSize="sm">{moment(team.updatedAt).format('D/MM/YYYY')}</Text>
                </Flex>

            </VStack>
        </Flex>
    );
};
