'use client';

import React from 'react';
import {Box, Flex, FormControl, Heading, IconButton, Image, Input, Spinner, Text, VStack} from "@chakra-ui/react";
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

interface User {
    id: number;
    email: string;
    aboutMe: string | null;
    jobTitle: string;
    imageUrl: string;
    customerId: number | null;
    siteId: number;
    teamId: number;
    role: string;
    firstName: string;
    lastName: string;
    telephone: string;
    mobile: string;
    vehicleRegistration: string | null;
    jobLevelId: number;
    contractTypeId: number;
    titleId: number;
    lastLogin: string;
    isVerified: boolean;
    marketingOptOutId: number | null;
    uniqueId: string;
    emailVerifiedAt: string | null;
    departmentId: number | null;
    employStartDate: string | null;
    isProfileRegistered: boolean;
    remoteWorker: boolean;
    rememberToken: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    updatedBy: number;
    createdByUser: UserMeta;
    updatedByUser: UserMeta;
    customer: Customer | null;
    site: Site;
    jobLevel: JobLevel;
    contractType: ContractType;
    title: Title;
    marketingOptOut: string | null;
    hobbies: string[];
    languages: string[];
}

interface Customer {
    id: number;
    name: string;
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    postcode: string;
    country: string;
    customerCode: string;
    webAddress: string;
    singleSignOn: boolean;
    primaryContactId: number | null;
    businessTypeId: number;
    sectorId: number;
    regionId: number;
    companySizeId: number;
    companyNo: string;
    sicCode: string;
    numberOfEmployees: number;
    parentId: number | null;
    licensedUsers: number | null;
    contactLevelId: number | null;
    imageUrl: string;
    uniqueId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    updatedBy: number;
    multiSite: boolean;
}

interface UserMeta {
    id: number;
    email: string;
    aboutMe: string | null;
    jobTitle: string;
    imageUrl: string;
    customerId: number | null;
    siteId: number | null;
    teamId: number | null;
    role: string;
    firstName: string;
    lastName: string;
    telephone: string;
    mobile: string | null;
    vehicleRegistration: string | null;
    jobLevelId: number | null;
    contractTypeId: number | null;
    titleId: number | null;
    lastLogin: string;
    isVerified: boolean;
    marketingOptOutId: number | null;
    uniqueId: string;
    emailVerifiedAt: string | null;
    departmentId: number | null;
    employStartDate: string | null;
    isProfileRegistered: boolean;
    remoteWorker: boolean;
    rememberToken: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    updatedBy: number;
}

interface Site {
    id: number;
    siteName: string;
    siteEmail: string;
    siteTel: string;
    customerId: number;
    primaryContactId: number | null;
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    postcode: string;
    country: string;
    latitude: string;
    longitude: string;
    uniqueId: string;
    siteTypeId: number | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    updatedBy: number;
}

interface JobLevel {
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

interface ContractType {
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

interface Title {
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


interface UserDetailsBannerProps {
    user: User;
}

export const UserDetailsBanner: React.FC<UserDetailsBannerProps> = ({user}) => {

    const isCurrentUser = true; // TODO: Add logic to see if current user
    const isUploading = false; // TODO: Add logic to upload a new photo

    return (
        <Flex mb={4} p={4} borderRadius={8} color={'white'} overflow={'hidden'}>
            {/*Image Upload*/}
            <FormControl w={'100px'} h={'100px'} aspectRatio={1} borderRadius={'full'}>
                <Box
                    position="relative"
                    w={'100px'}
                    h={'100px'}
                    borderRadius="full"
                    overflow="hidden"
                    _hover={{'.overlay': {opacity: isCurrentUser ? 1 : 0}}} // Only show overlay if it's the current user
                >
                    <Image
                        boxSize="100px"
                        borderRadius="full"
                        objectFit={'cover'}
                        src={user.imageUrl}
                        alt={`${user.firstName} ${user.lastName}`}
                        // cursor={isCurrentUser ? "pointer" : "default"}  // Only allow pointer if it's the current user
                        fallback={
                            <Flex
                                align={'center'}
                                justify={'center'}
                                w={'100px'}
                                h={'100px'}
                                borderRadius="full"
                                bg="gray.200"
                                // cursor={isCurrentUser ? "pointer" : "default"}  // Only allow pointer if it's the current user
                            >
                                <Text
                                    color="gray.500"
                                    m={'auto'}
                                    fontSize={'xx-large'}
                                >
                                    {user.firstName[0]}
                                    {user.lastName[0]}
                                </Text>
                            </Flex>
                        }
                    />
                    {isCurrentUser && (
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
                                icon={<AddAPhotoOutlinedIcon/>}
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
                {isCurrentUser && (
                    <Input
                        id="photo-upload"
                        type="file"
                        name="photo"
                        mb={4}
                        onChange={() => {
                            window.alert("Uploading a photo FAKE")
                        }}
                        disabled={isUploading}
                        display="none"
                    />
                )}
            </FormControl>
            {/*User Details*/}
            <VStack align="start" ml={4}>
                <Heading size="lg" fontWeight={100}>{user.firstName} {user.lastName}</Heading>

                <Flex direction={'row'} justify={'center'} align={'center'} gap={2}>
                    <EmailOutlinedIcon/>
                    <Text fontSize="md">{user.email}</Text>
                </Flex>
                <Flex direction={'row'} justify={'center'} align={'center'} gap={2}>
                    <LocationOnOutlinedIcon/>
                    <Text fontSize="sm">
                        {user.site ? user.site.siteName : "Unknown"}
                    </Text>
                </Flex>
            </VStack>
            {/* Organisation Details*/}
            <VStack ml={'auto'} alignItems={'end'} justifyContent={'flex-end'} display={['none', 'none', 'flex']}>
                <Text fontSize="lg">  ID: {user.id} </Text>
                {/* Organisation's Logo */}
                {user.customer && (
                    <Image
                        mt={'auto'}
                        maxHeight={'50px'}
                        maxWidth={'150px'}
                        objectFit={'contain'}
                        src={user.customer?.imageUrl || ""}
                        alt={`${user.customer.name} Logo`}
                        fallback={
                            <Flex
                                align={'center'}
                                justify={'center'}
                                minW={'100px'}
                                h={'full'}
                                bg="gray.200"
                            >
                                <Text
                                    color="gray.500"
                                    m={'auto'}
                                    fontSize={'lg'}
                                >
                                    {user.customer.name[0]}
                                </Text>
                            </Flex>
                        }
                    />
                )}
            </VStack>
        </Flex>
    );
}