'use client';

import React from 'react';
import {Box, Flex, FormControl, Heading, Text, VStack, Badge} from '@chakra-ui/react';
import ApartmentIcon from '@mui/icons-material/Apartment';
import GroupIcon from '@mui/icons-material/Group';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import moment from "moment/moment"; // For fallback or general case icon

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
                    {isDepartment ? (
                        <ApartmentIcon fontSize="large" style={{fontSize: '48px', color: 'gray'}}/>
                    ) : (
                        <GroupIcon fontSize="large" style={{fontSize: '48px', color: 'gray'}}/>
                    )}
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
            <VStack ml={'auto'} display={['none', 'none', 'flex']} alignItems="flex-end">
                <Text fontSize="2xl" fontWeight={300}>ID: {team.id}</Text>
                <Text fontSize="sm">Created At: {moment(team.createdAt).format('D/MM/YYYY, h:mm:ss a')}</Text>
                <Text fontSize="sm">Updated At: {moment(team.updatedAt).format('D/MM/YYYY, h:mm:ss a')}</Text>
            </VStack>
        </Flex>
    );
};
