'use client';

import React from 'react';
import {Box, Flex, FormControl, Heading, IconButton, Image, Input, Spinner, Text, VStack} from "@chakra-ui/react";
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import DomainIcon from '@mui/icons-material/Domain';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CreateIcon from '@mui/icons-material/Create';
import UpdateIcon from '@mui/icons-material/Update';
import moment from "moment/moment";
import {useRouter} from "next/navigation"
import {useUser} from "@/context/AdminUserContext";
import {useMediaUploader} from "@/hooks/useMediaUploader";

interface User {
    id: number;
    email: string;
    aboutMe?: string;
    jobTitle?: string;
    imageUrl?: string;
    customerId?: number | null;
    siteId?: number;
    teamId?: number;
    role: string;
    firstName?: string;
    lastName?: string;
    telephone?: string;
    mobile?: string;
    vehicleRegistration?: string;
    jobLevelId?: number;
    contractTypeId?: number;
    titleId?: number;
    lastLogin?: string;
    isVerified?: boolean;
    marketingOptOutId?: number;
    uniqueId: string;
    emailVerifiedAt?: string;
    departmentId?: number;
    employStartDate?: string;
    isProfileRegistered?: boolean;
    remoteWorker?: boolean;
    rememberToken?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy?: number;
    updatedBy?: number;
    createdByUser?: UserMeta;
    updatedByUser?: UserMeta;
    customer?: Customer;
    site?: Site;
    jobLevel?: JobLevel;
    contractType?: ContractType;
    title?: Title;
    marketingOptOut?: string;
    hobbies?: string[];
    languages?: string[];
}

interface Customer {
    id: number;
    name: string;
    address1: string;
    address2?: string;
    address3?: string;
    address4?: string;
    postcode: string;
    country?: string;
    customerCode?: string;
    webAddress?: string;
    singleSignOn: boolean;
    primaryContactId?: number | null;
    businessTypeId: number;
    sectorId: number;
    regionId: number;
    companySizeId: number;
    companyNo?: string;
    sicCode?: string;
    numberOfEmployees?: number;
    parentId?: number | null;
    licensedUsers?: number | null;
    contactLevelId?: number | null;
    imageUrl?: string;
    uniqueId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    updatedBy: number;
    multiSite?: boolean;
}

interface UserMeta {
    id: number;
    email: string;
    aboutMe?: string | null;
    jobTitle?: string;
    imageUrl?: string;
    customerId?: number | null;
    siteId?: number | null;
    teamId?: number | null;
    role: string;
    firstName?: string;
    lastName?: string;
    telephone?: string;
    mobile?: string | null;
    vehicleRegistration?: string | null;
    jobLevelId?: number | null;
    contractTypeId?: number | null;
    titleId?: number | null;
    lastLogin?: string;
    isVerified?: boolean;
    marketingOptOutId?: number | null;
    uniqueId: string;
    emailVerifiedAt?: string | null;
    departmentId?: number | null;
    employStartDate?: string | null;
    isProfileRegistered?: boolean;
    remoteWorker?: boolean;
    rememberToken?: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy?: number;
    updatedBy?: number;
}

interface Site {
    id: number;
    siteName: string;
    siteEmail?: string;
    siteTel?: string;
    customerId?: number;
    primaryContactId?: number | null;
    address1: string;
    address2: string;
    address3?: string;
    address4?: string;
    postcode: string;
    country?: string;
    latitude?: string;
    longitude?: string;
    uniqueId: string;
    siteTypeId?: number | null;
    isActive?: boolean;
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
    const currentUser = useUser();
    const router = useRouter();

    const isCurrentUser = user.uniqueId === currentUser.userUniqueId;
    const allowedToUploadPhoto = (
        isCurrentUser ||
        (currentUser.role === 'PA') ||
        (currentUser.role === 'CA' && currentUser.customerId === user.customerId) ||
        (currentUser.role === 'CA' && currentUser.customerId === user?.customer?.parentId)
    );

    // Using the media uploader hook for profile photo
    const {isUploading, handleFileChange} = useMediaUploader(
        `/api/user/uploadPhoto/${user.uniqueId}`,
        "imageUrl",
        () => {
            router.refresh()
        }
    );

    return (
        <Flex mb={4} p={[0, 0, 4]} borderRadius={8} color={'white'} overflow={'hidden'}>
            {/*Image Upload*/}
            <FormControl w={'100px'} h={'100px'} aspectRatio={1} borderRadius={'full'}>
                <Box
                    position="relative"
                    w={'100px'}
                    h={'100px'}
                    borderRadius="full"
                    overflow="hidden"
                    _hover={{'.overlay': {opacity: allowedToUploadPhoto ? 1 : 0}}}
                >
                    <Image
                        boxSize="100px"
                        borderRadius="full"
                        objectFit={'cover'}
                        src={user.imageUrl}
                        alt={`${user.firstName} ${user.lastName}`}
                        cursor={allowedToUploadPhoto ? "pointer" : "default"}
                        fallback={
                            <Flex
                                align={'center'}
                                justify={'center'}
                                w={'100px'}
                                h={'100px'}
                                borderRadius="full"
                                bg="gray.200"
                                cursor={allowedToUploadPhoto ? "pointer" : "default"}
                            >
                                <Text
                                    color="gray.500"
                                    m={'auto'}
                                    fontSize={'xx-large'}
                                >
                                    {user.firstName?.[0] ?? ''}
                                    {user.lastName?.[0] ?? ''}
                                </Text>
                            </Flex>
                        }
                    />
                    {allowedToUploadPhoto && (
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
                                icon={<AddAPhotoOutlinedIcon fontSize="large"
                                                             sx={{color: "var(--chakra-colors-perygonPink)"}}/>}
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
                            bg="rgba(0, 0, 0, 0.5)"
                            borderRadius="full"
                        >
                            <Spinner size="md"/>
                        </Flex>
                    )}
                </Box>
                {allowedToUploadPhoto && (
                    <Input
                        id="photo-upload"
                        type="file"
                        name="imageUrl"
                        mb={4}
                        onChange={handleFileChange}  // Connect the file input to the uploader
                        disabled={isUploading}
                        display="none"
                    />
                )}
            </FormControl>
            {/*User Details*/}
            <VStack align="start" ml={4}>
                <Flex alignItems="center" gap={2}>
                    <Box
                        w={'1.4rem'}
                        h={'1.4rem'}
                        borderRadius="full"
                        border={'white 1px solid'}
                        bg={user.isActive ? 'green.500' : 'red.500'}
                    />
                    <Heading fontWeight={100} size={['md', 'md', 'lg']}>
                        {user.firstName ?? 'No Name'} {user.lastName ?? ''}
                    </Heading>
                </Flex>

                <Flex direction={'row'} justify={'center'} align={'flex-start'} gap={2}>
                    <EmailOutlinedIcon/>
                    <Text fontSize="sm" as={'a'} href={`mailto:${user.email}`}
                          _hover={{textDecoration: 'underline', cursor: 'pointer'}}>
                        {user.email}
                    </Text>
                </Flex>
                <Flex direction={'row'} justify={'center'} align={'flex-start'} gap={2}>
                    <DomainIcon/>
                    {user.customer && (
                        <Text fontSize="sm" _hover={{textDecoration: 'underline', cursor: 'pointer'}}
                              onClick={() => router.push(`/customers/${user.customer?.uniqueId}`)}>
                            {user.customer.name}
                        </Text>
                    )}
                </Flex>
                <Flex direction={'row'} justify={'center'} align={'center'} gap={2}>
                    <LocationOnOutlinedIcon/>
                    {user.site ? (
                        <Text fontSize="sm" _hover={{textDecoration: 'underline', cursor: 'pointer'}}
                              onClick={() => router.push(`/sites/${user.site?.uniqueId}`)}>
                            {user.site.siteName}
                        </Text>
                    ) : (
                        <Text fontSize="sm">Unknown</Text>
                    )}
                </Flex>
            </VStack>
            {/* User Details*/}
            <VStack ml={'auto'} alignItems={'end'} justifyContent={'flex-start'} display={['none', 'none', 'flex']}>
                <Heading size={['md', 'md', 'lg']} fontWeight={100}>ID: {user.id}</Heading>
                <Flex direction="row" justify="center" align="center" gap={2}>
                    <CreateIcon/>
                    <Text fontSize="sm">{moment(user.createdAt).format('D/MM/YYYY')}</Text>
                </Flex>
                <Flex direction="row" justify="center" align="center" gap={2}>
                    <UpdateIcon/>
                    <Text fontSize="sm">{moment(user.updatedAt).format('D/MM/YYYY')}</Text>
                </Flex>
            </VStack>
        </Flex>
    );
};