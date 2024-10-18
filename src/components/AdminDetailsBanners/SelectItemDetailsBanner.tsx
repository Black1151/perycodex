'use client';

import React from 'react';
import {Box, Flex, FormControl, Heading, Text, VStack} from '@chakra-ui/react';
import moment from 'moment';
import CreateIcon from '@mui/icons-material/Create';
import UpdateIcon from '@mui/icons-material/Update';
import {Checklist} from "@mui/icons-material";

interface SelectItem {
    id: number;
    type: string;
    label: string;
    value: string;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    updatedBy: number;
}

interface SelectItemDetailsBannerProps {
    selectItem: SelectItem;
}

export const SelectItemDetailsBanner: React.FC<SelectItemDetailsBannerProps> = ({selectItem}) => {
    return (
        <Flex mb={4} p={4} color={'white'} overflow={'hidden'}>
            {/* SelectItem Icon and Label */}
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
                    <Checklist fontSize="large" style={{fontSize: '48px', color: 'gray'}}/>
                </Box>
            </FormControl>

            {/* SelectItem Information */}
            <VStack align="start" ml={4} minW={'300px'} spacing={3}>
                <Flex alignItems="center">
                    <Heading fontWeight={300}>{selectItem.label}</Heading>
                </Flex>


            </VStack>

            {/* Metadata Information */}
            <VStack ml={'auto'} alignItems={'end'} justifyContent={'flex-start'} display={['none', 'none', 'flex']}>
                <Heading size="lg" fontWeight={100}>ID: {selectItem.id}</Heading>
                <Flex direction={'row'} justify={'center'} align={'center'} gap={2}>
                    <CreateIcon/>
                    <Text fontSize="sm">{moment(selectItem.createdAt).format('D/MM/YYYY')}</Text>
                </Flex>
                <Flex direction={'row'} justify={'center'} align={'center'} gap={2}>
                    <UpdateIcon/>
                    <Text fontSize="sm">{moment(selectItem.updatedAt).format('D/MM/YYYY')}</Text>
                </Flex>
            </VStack>
        </Flex>
    );
};
