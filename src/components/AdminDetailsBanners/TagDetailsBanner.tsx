'use client';

import React from 'react';
import {Badge, Box, Flex, FormControl, Heading, Image, Text, VStack} from '@chakra-ui/react';
import moment from 'moment';
import CreateIcon from '@mui/icons-material/Create';
import UpdateIcon from '@mui/icons-material/Update';
import SellIcon from '@mui/icons-material/Sell'

interface Tag {
    id: number;
    name: string;
    colour: string;
    icon: string;
    score: number;
    weight: string;
    customerId: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    updatedBy: number;
}

interface TagDetailsBannerProps {
    tag: Tag;
}

export const TagDetailsBanner: React.FC<TagDetailsBannerProps> = ({tag}) => {
    return (
        <Flex mb={4} p={4} color={'white'} overflow={'hidden'}>
            {/* Tag Icon and Name */}
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
                    <Image
                        src={tag.icon}
                        alt={tag.name}
                        w={'100px'}
                        h={'100px'}
                        borderRadius="full"
                        objectFit="cover"
                        fallback={
                            <>
                                <SellIcon fontSize="large" sx={{color: "var(--chakra-colors-perygonPink)"}}/>
                            </>
                        }
                    />
                </Box>
            </FormControl>

            {/* Tag Information */}
            <VStack align="start" ml={4} minW={'300px'} spacing={3}>
                <Flex alignItems="center" gap={2}>
                    <Box
                        w={'1.4rem'}
                        h={'1.4rem'}
                        borderRadius="full"
                        border={'white 1px solid'}
                        bg={tag.isActive ? 'green.500' : 'red.500'}
                    />
                    <Heading fontWeight={300} size={['md', 'md', 'lg']}>{tag.name}</Heading>

                </Flex>

                {/* Tag Score and Weight */}
                <Flex direction="row" gap={4}>
                    <Badge
                        px={2}
                        py={1}
                        borderRadius="md"
                        backgroundColor={tag.colour} // Using the hex color from tag.colour for the background
                        border={'1px solid'}
                        borderColor={'white'}
                        color="white" // Assuming the text color should be white
                    >
                        {tag.name}
                    </Badge>
                </Flex>
            </VStack>

            {/* Metadata Information */}
            <VStack ml={'auto'} alignItems={'end'} justifyContent={'flex-start'} display={['none', 'none', 'flex']}>
                <Heading size={['md', 'md', 'lg']} fontWeight={100}>ID: {tag.id}</Heading>
                <Flex direction={'row'} justify={'center'} align={'center'} gap={2}>
                    <CreateIcon/>
                    <Text fontSize="sm">{moment(tag.createdAt).format('D/MM/YYYY')}</Text>
                </Flex>
                <Flex direction={'row'} justify={'center'} align={'center'} gap={2}>
                    <UpdateIcon/>
                    <Text fontSize="sm">{moment(tag.updatedAt).format('D/MM/YYYY')}</Text>
                </Flex>
            </VStack>
        </Flex>
    );
};
