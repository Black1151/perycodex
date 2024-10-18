'use client';

import React from 'react';
import {Box, Flex, FormControl, Heading, IconButton, Image, Text, VStack} from '@chakra-ui/react';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import {LocationOn} from "@mui/icons-material";
import moment from "moment/moment";
import CreateIcon from "@mui/icons-material/Create";
import UpdateIcon from "@mui/icons-material/Update";

interface Site {
    id: number;
    siteName: string;
    siteEmail: string;
    siteTel: string;
    address1: string;
    address2: string;
    address3: string;
    postcode: string;
    country: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface SiteDetailsBannerProps {
    site: Site;
}

export const SiteDetailsBanner: React.FC<SiteDetailsBannerProps> = ({site}) => {
    return (
        <Flex mb={4} p={4} color={'white'} overflow={'hidden'}>
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
                    <LocationOn fontSize="large" style={{fontSize: '48px', color: 'gray'}}/>
                </Box>
            </FormControl>

            {/* Site Information */}
            <VStack align="start" ml={4} minW={'300px'} spacing={3}>
                <Flex alignItems="center">
                    <Heading fontWeight={300}>{site.siteName}</Heading>
                    <Box
                        ml={2}
                        w={4}
                        h={4}
                        borderRadius="full"
                        border={'white 1px solid'}
                        bg={site.isActive ? 'green.500' : 'red.500'}
                    />
                </Flex>
                <Flex direction={'row'} align={'center'} gap={2}>
                    <LocationOnOutlinedIcon/>
                    <Text fontSize="sm">
                        {site.address1}, {site.address2}, {site.address3}, {site.postcode}, {site.country}
                    </Text>
                </Flex>

                <Flex direction={'row'} align={'center'} gap={2}>
                    <EmailOutlinedIcon/>
                    <Text fontSize="sm">{site.siteEmail}</Text>
                </Flex>

                <Flex direction={'row'} align={'center'} gap={2}>
                    <PhoneOutlinedIcon/>
                    <Text fontSize="sm">{site.siteTel}</Text>
                </Flex>

            </VStack>

            {/* Site ID on the right */}
            <VStack ml={'auto'} alignItems={'end'} justifyContent={'flex-start'} display={['none', 'none', 'flex']}>
                <Heading size="lg" fontWeight={100}>ID: {site.id}</Heading>
                <Flex direction={'row'} justify={'center'} align={'center'} gap={2}>
                    <CreateIcon/>
                    <Text fontSize="sm">{moment(site.createdAt).format('D/MM/YYYY')}</Text>
                </Flex>
                <Flex direction={'row'} justify={'center'} align={'center'} gap={2}>
                    <UpdateIcon/>
                    <Text fontSize="sm">{moment(site.updatedAt).format('D/MM/YYYY')}</Text>
                </Flex>

            </VStack>
        </Flex>
    );
};
