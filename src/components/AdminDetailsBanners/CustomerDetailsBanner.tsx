'use client';

import React from 'react';
import {Box, Flex, FormControl, Heading, IconButton, Image, Input, Spinner, Text, VStack,} from '@chakra-ui/react';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

interface Customer {
    id: number;
    name: string;
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    postcode: string;
    country: string;
    customerCode: string | null;
    webAddress: string;
    singleSignOn: false;
    primaryContactId: number | null;
    businessTypeId: number;
    sectorId: number;
    regionId: number;
    companySizeId: number;
    companyNo: string | null;
    sicCode: string | null;
    numberOfEmployees: number;
    parentId: number | null;
    licensedUsers: number;
    contactLevelId: number | null;
    imageUrl: string;
    uniqueId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    updatedBy: number;
    multiSite: boolean
}

interface CustomerDetailsBannerProps {
    customer: Customer;
}

export const CustomerDetailsBanner: React.FC<CustomerDetailsBannerProps> = ({
                                                                  customer,
                                                              }) => {


    const allowUpload = true;
    const isUploading = false;

    return (
        <Flex mb={4} p={4} borderRadius={8} color={'white'} overflow={'hidden'}>
            {/* Customer Logo Upload */}
            <FormControl w={'100px'} h={'100px'} aspectRatio={1} borderRadius={'full'}>
                <Box
                    position="relative"
                    w={'100px'}
                    h={'100px'}
                    borderRadius="full"
                    overflow="hidden"
                    _hover={{'.overlay': {opacity: allowUpload ? 1 : 0}}} // Only show overlay if upload is allowed
                >
                    <Image
                        boxSize="100px"
                        borderRadius="full"
                        objectFit={'contain'}
                        src={customer.imageUrl}
                        alt={customer.name}
                        fallback={
                            <Flex
                                align={'center'}
                                justify={'center'}
                                w={'100px'}
                                h={'100px'}
                                borderRadius="full"
                                bg="gray.200"
                                cursor={allowUpload ? 'pointer' : 'default'} // Allow pointer only if upload is allowed
                            >
                                <Text color="gray.500" m={'auto'} fontSize={'xx-large'}>
                                    {customer.name[0]}
                                </Text>
                            </Flex>
                        }
                    />
                    {allowUpload && (
                        <Box
                            className="overlay"
                            position="absolute"
                            top="0"
                            left="0"
                            w="100%"
                            h="100%"
                            bg="rgba(0, 0, 0, 0.5)"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            borderRadius="full"
                            opacity={0}
                            transition="opacity 0.3s ease"
                        >
                            <IconButton
                                icon={<AddAPhotoOutlinedIcon />}
                                aria-label="Upload Photo"
                                colorScheme="whiteAlpha"
                                onClick={() => document.getElementById('photo-upload')?.click()}
                            />
                        </Box>
                    )}
                    {isUploading && (
                        <Flex
                            position="absolute"
                            top="0"
                            left="0"
                            w="100%"
                            h="100%"
                            justifyContent="center"
                            alignItems="center"
                            bg="rgba(0, 0, 0, 0.5)" // Optional: Add a background overlay during uploading
                            borderRadius="full"
                        >
                            <Spinner size="md"/>
                        </Flex>
                    )}
                </Box>
                {allowUpload && (
                    <Input
                        id="photo-upload"
                        type="file"
                        name="photo"
                        mb={4}
                        onChange={() => {window.alert("Uploading file FAKE")}}
                        disabled={isUploading}
                        display="none"
                    />
                )}
            </FormControl>

            {/* Customer Details */}
            <VStack align="start" ml={4} minW={'300px'}>
                <Heading fontWeight={100}>{customer.name}</Heading>
                {customer.address1 && (
                    <Flex direction={'row'} justify={'center'} align={'center'} gap={2}>
                        <LocationOnOutlinedIcon />
                        <Text fontSize="sm">{customer.address1}, {customer.address2}, {customer.address3}, {customer.address4}, {customer.postcode}</Text>
                    </Flex>
                )}
            </VStack>

            {/* Customer ID */}
            <VStack ml={'auto'} display={['none', 'none', 'flex']}>
                <Text fontSize="lg"> ID: {customer.id} </Text> {/* Increase font size here */}
            </VStack>
        </Flex>
    );
};