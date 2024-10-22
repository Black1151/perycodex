'use client';

import React from 'react';
import {Box, Flex, FormControl, Heading, Text, VStack} from '@chakra-ui/react';
import moment from 'moment';
import CreateIcon from '@mui/icons-material/Create';
import UpdateIcon from '@mui/icons-material/Update';
import {FormatListNumbered} from "@mui/icons-material";

export interface OptionListGroup {
    id: number;
    name: string;
    description: string;
    customerId: number;
    isActive: boolean;
    createdAt: string; // ISO date string (e.g., "2023-09-01T10:00:00Z")
    updatedAt: string; // ISO date string (e.g., "2023-09-10T10:00:00Z")
    createdBy: number;
    updatedBy: number;
}

interface OptionListGroupDetailsBannerProps {
    optionListGroup: OptionListGroup;
}

export const OptionListGroupDetailsBanner: React.FC<OptionListGroupDetailsBannerProps> = ({optionListGroup}) => {
    return (
        <Flex mb={4} p={4} color={'white'} overflow={'hidden'}>
            {/* OptionListGroup Icon and Name */}
            {/* Site Icon and Name */}
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
                    <FormatListNumbered fontSize="large" sx={{color: "var(--chakra-colors-perygonPink)"}}/>
                </Box>
            </FormControl>

            {/* OptionListGroup Information */}
            <VStack align="start" ml={4} minW={'300px'} spacing={3}>
                <Flex alignItems="center">
                    <Heading fontWeight={300} size={['md', 'md', 'lg']}>{optionListGroup.name}</Heading>
                    <Box
                        ml={2}
                        w={4}
                        h={4}
                        borderRadius="full"
                        border={'white 1px solid'}
                        bg={optionListGroup.isActive ? 'green.500' : 'red.500'}
                    />
                </Flex>


            </VStack>

            {/* Metadata Information */}
            <VStack ml={'auto'} alignItems={'end'} justifyContent={'flex-start'} display={['none', 'none', 'flex']}>
                <Heading size={['md', 'md', 'lg']} fontWeight={100}>ID: {optionListGroup.id}</Heading>
                <Flex direction={'row'} justify={'center'} align={'center'} gap={2}>
                    <CreateIcon/>
                    <Text fontSize="sm">{moment(optionListGroup.createdAt).format('D/MM/YYYY')}</Text>
                </Flex>
                <Flex direction={'row'} justify={'center'} align={'center'} gap={2}>
                    <UpdateIcon/>
                    <Text fontSize="sm">{moment(optionListGroup.updatedAt).format('D/MM/YYYY')}</Text>
                </Flex>
            </VStack>
        </Flex>
    );
};
