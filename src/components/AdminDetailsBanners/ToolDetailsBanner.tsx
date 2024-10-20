'use client';

import React from 'react';
import { Box, Flex, FormControl, Heading, Text, VStack, Image } from '@chakra-ui/react';
import moment from 'moment';
import CreateIcon from '@mui/icons-material/Create';
import UpdateIcon from '@mui/icons-material/Update';
import { FormatAlignCenter } from '@mui/icons-material';

interface Tool {
    id: number;
    name: string;
    description: string;
    previewText: string;
    iconImageUrl: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    categoryId: number;
    appUrl: string;
}

interface ToolDetailsBannerProps {
    tool: Tool;
}

export const ToolDetailsBanner: React.FC<ToolDetailsBannerProps> = ({ tool }) => {
    return (
        <Flex mb={4} p={4} color={'white'} overflow={'hidden'}>
            {/* Tool Icon */}
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
                    {/* Display the toolConfig's icon image */}
                    {tool.iconImageUrl ? (
                        <Image
                            src={tool.iconImageUrl}
                            alt={tool.name}
                            w="full"
                            h="full"
                            objectFit="contain"
                            borderRadius="full"
                        />
                    ) : (
                        <FormatAlignCenter fontSize="large" style={{ fontSize: '48px', color: 'gray' }} />
                    )}
                </Box>
            </FormControl>

            {/* Tool Information */}
            <VStack align="start" ml={4} minW={'300px'} spacing={3}>
                <Flex alignItems="center">
                    <Heading fontWeight={300}>{tool.name}</Heading>
                    <Box
                        ml={2}
                        w={4}
                        h={4}
                        borderRadius="full"
                        border={'white 1px solid'}
                        bg={tool.isActive ? 'green.500' : 'red.500'}
                    />
                </Flex>
                <Text fontSize="sm">{tool.previewText}</Text>
            </VStack>

            {/* Metadata Information */}
            <VStack ml={'auto'} alignItems={'end'} justifyContent={'flex-start'} display={['none', 'none', 'flex']}>
                <Heading size="lg" fontWeight={100}>ID: {tool.id}</Heading>
                <Flex direction={'row'} justify={'center'} align={'center'} gap={2}>
                    <CreateIcon />
                    <Text fontSize="sm">{moment(tool.createdAt).format('D/MM/YYYY')}</Text>
                </Flex>
                <Flex direction={'row'} justify={'center'} align={'center'} gap={2}>
                    <UpdateIcon />
                    <Text fontSize="sm">{moment(tool.updatedAt).format('D/MM/YYYY')}</Text>
                </Flex>
            </VStack>
        </Flex>
    );
};
