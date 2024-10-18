'use client';

import React from 'react';
import {Box, Flex, FormControl, Heading, Text, VStack, Image} from '@chakra-ui/react';
import moment from 'moment';
import CreateIcon from '@mui/icons-material/Create';
import UpdateIcon from '@mui/icons-material/Update';
import {FormatAlignCenter} from "@mui/icons-material";

interface Form {
    id: number;
    name: string;
    description: string;
    jsonFile: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    updatedBy: number;
}

interface FormDetailsBannerProps {
    form: Form;
}

export const FormDetailsBanner: React.FC<FormDetailsBannerProps> = ({form}) => {
    return (
        <Flex mb={4} p={4} color={'white'} overflow={'hidden'}>
            {/* Form Icon and Name */}
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
                    <FormatAlignCenter fontSize="large" style={{fontSize: '48px', color: 'gray'}}/>
                </Box>
            </FormControl>

            {/* Form Information */}
            <VStack align="start" ml={4} minW={'300px'} spacing={3}>
                <Flex alignItems="center">
                    <Heading fontWeight={300}>{form.name}</Heading>
                    <Box
                        ml={2}
                        w={4}
                        h={4}
                        borderRadius="full"
                        border={'white 1px solid'}
                        bg={form.isActive ? 'green.500' : 'red.500'}
                    />
                </Flex>


            </VStack>

            {/* Metadata Information */}
            <VStack ml={'auto'} alignItems={'end'} justifyContent={'flex-start'} display={['none', 'none', 'flex']}>
                <Heading size="lg" fontWeight={100}>ID: {form.id}</Heading>
                <Flex direction={'row'} justify={'center'} align={'center'} gap={2}>
                    <CreateIcon/>
                    <Text fontSize="sm">{moment(form.createdAt).format('D/MM/YYYY')}</Text>
                </Flex>
                <Flex direction={'row'} justify={'center'} align={'center'} gap={2}>
                    <UpdateIcon/>
                    <Text fontSize="sm">{moment(form.updatedAt).format('D/MM/YYYY')}</Text>
                </Flex>
            </VStack>
        </Flex>
    );
};
