'use client';

import React from 'react';
import {Box, Flex, FormControl, Heading, Text, VStack} from '@chakra-ui/react';
import moment from 'moment';
import {Create, FormatListNumbered, Update} from "@mui/icons-material";

interface OptionList {
    id: number;
    name: string;
    description?: string;
    isEditableByCustomer?: boolean;
    optionListGroupId?: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    updatedBy: number;
}

interface OptionListDetailsBannerProps {
    optionList: OptionList;
}

export const OptionListDetailsBanner: React.FC<OptionListDetailsBannerProps> = ({optionList}) => {
    return (
        <Flex mb={4} p={4} color={'white'} overflow={'hidden'}>
            {/* OptionList Icon and Name */}
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

            {/* OptionList Information */}
            <VStack align="start" ml={4} spacing={3}>
                <Flex alignItems="center" gap={2}>
                    <Box
                        w={'1.4rem'}
                        h={'1.4rem'}
                        borderRadius="full"
                        border={'white 1px solid'}
                        bg={optionList.isActive ? 'green.500' : 'red.500'}
                    />
                    <Heading fontWeight={300} size={['md', 'md', 'lg']}>{optionList.name}</Heading>
                </Flex>
            </VStack>

            {/* Metadata Information */}
            <VStack ml={'auto'} alignItems={'end'} justifyContent={'flex-start'} display={['none', 'none', 'flex']}>
                <Heading size={['md', 'md', 'lg']} fontWeight={100}>ID: {optionList.id}</Heading>
                <Flex direction={'row'} justify={'center'} align={'center'} gap={2}>
                    <Create/>
                    <Text fontSize="sm">{moment(optionList.createdAt).format('D/MM/YYYY')}</Text>
                </Flex>
                <Flex direction={'row'} justify={'center'} align={'center'} gap={2}>
                    <Update/>
                    <Text fontSize="sm">{moment(optionList.updatedAt).format('D/MM/YYYY')}</Text>
                </Flex>
            </VStack>
        </Flex>
    );
};
