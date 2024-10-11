'use client';

import React from 'react';
import {Box, Flex, FormControl, Heading, Text, VStack} from '@chakra-ui/react';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import moment from 'moment';  // Import moment.js to format the date

interface UserGroup {
    id: number;
    name: string;
    description: string;
    customerId: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    updatedBy: number;
    uniqueId: string;
}

interface UserGroupDetailsBannerProps {
    userGroup: UserGroup;
}

export const UserGroupDetailsBanner: React.FC<UserGroupDetailsBannerProps> = ({userGroup}) => {
    return (
        <Flex mb={4} p={4} color={'white'} overflow={'hidden'}>
            {/* User Group Icon and Name */}
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
                    <BusinessOutlinedIcon fontSize="large" style={{fontSize: '48px', color: 'gray'}}/>
                </Box>
            </FormControl>

            {/* User Group Information */}
            <VStack align="start" ml={4} minW={'300px'} spacing={3}>
                <Flex alignItems="center">
                    <Heading fontWeight={300}>{userGroup.name}</Heading>
                    <Box
                        ml={2}
                        w={4}
                        h={4}
                        borderRadius="full"
                        border={'white 1px solid'}
                        bg={userGroup.isActive ? 'green.500' : 'red.500'}
                    />
                </Flex>
            </VStack>

            {/* ID, CreatedAt, and UpdatedAt */}
            <VStack ml={'auto'} display={['none', 'none', 'flex']} alignItems="flex-end">
                <Text fontSize="2xl" fontWeight={300}>ID: {userGroup.id}</Text>
                <Text fontSize="sm">Created At: {moment(userGroup.createdAt).format('D/MM/YYYY, h:mm:ss a')}</Text>
                <Text fontSize="sm">Updated At: {moment(userGroup.updatedAt).format('D/MM/YYYY, h:mm:ss a')}</Text>
            </VStack>
        </Flex>
    );
};
