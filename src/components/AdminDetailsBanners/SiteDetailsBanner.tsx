'use client';

import React from 'react';
import { Box, Flex, FormControl, Heading, IconButton, Image, Text, VStack } from '@chakra-ui/react';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';

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
}

interface SiteDetailsBannerProps {
    site: Site;
}

export const SiteDetailsBanner: React.FC<SiteDetailsBannerProps> = ({ site }) => {
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
                    <BusinessOutlinedIcon fontSize="large" style={{ fontSize: '48px', color: 'gray' }} />
                </Box>
            </FormControl>

            {/* Site Information */}
            <VStack align="start" ml={4} minW={'300px'} spacing={3}>
                <Heading fontWeight={600}>{site.siteName}</Heading>
                <Flex direction={'row'} align={'center'} gap={2}>
                    <LocationOnOutlinedIcon />
                    <Text fontSize="sm">
                        {site.address1}, {site.address2}, {site.address3}, {site.postcode}, {site.country}
                    </Text>
                </Flex>

                <Flex direction={'row'} align={'center'} gap={2}>
                    <EmailOutlinedIcon />
                    <Text fontSize="sm">{site.siteEmail}</Text>
                </Flex>

                <Flex direction={'row'} align={'center'} gap={2}>
                    <PhoneOutlinedIcon />
                    <Text fontSize="sm">{site.siteTel}</Text>
                </Flex>

            </VStack>

            {/* Site ID on the right */}
            <VStack ml={'auto'} display={['none', 'none', 'flex']}>
                <Text fontSize="lg"> ID: {site.id}</Text>
            </VStack>
        </Flex>
    );
};
