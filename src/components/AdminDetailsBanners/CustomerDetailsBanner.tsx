'use client';

import React from 'react';
import {Box, Flex, FormControl, Heading, IconButton, Image, Input, Spinner, Text, VStack,} from '@chakra-ui/react';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LanguageIcon from "@mui/icons-material/Language"
import moment from "moment/moment";
import CreateIcon from "@mui/icons-material/Create";
import UpdateIcon from "@mui/icons-material/Update";
import {useUser} from "@/context/AdminUserContext";
import {useMediaUploader} from "@/hooks/useMediaUploader";
import {useRouter} from "next/navigation";

interface Customer {
    id: number;
    name: string;
    address1: string;
    address2?: string;
    address3?: string;
    address4?: string;
    postcode: string;
    country?: string;
    customerCode?: string | null;
    webAddress?: string;
    singleSignOn: false;
    primaryContactId?: number | null;
    businessTypeId: number;
    sectorId: number;
    regionId: number;
    companySizeId: number;
    companyNo?: string | null;
    sicCode?: string | null;
    numberOfEmployees?: number;
    parentId?: number | null;
    licensedUsers?: number;
    contactLevelId?: number | null;
    imageUrl?: string;
    uniqueId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    updatedBy: number;
    multiSite?: boolean
}

interface CustomerDetailsBannerProps {
    customer: Customer;
}

export const CustomerDetailsBanner: React.FC<CustomerDetailsBannerProps> = ({
                                                                                customer,
                                                                            }) => {
    const currentUser = useUser();
    const router = useRouter();

    const allowedToUploadPhoto =
        (currentUser.role === 'PA' ||
            (currentUser.role === 'CA' && currentUser.customerId === customer.id) ||
            (currentUser.role === 'CA' && currentUser.customerId === customer.parentId)
        );

    // Using the media uploader hook for profile photo
    const {isUploading, handleFileChange} = useMediaUploader(
        `/api/customer/uploadPhoto/${customer.uniqueId}`,
        "imageUrl",
        () => {
            router.refresh()
        }
    );

    return (
        <Flex mb={4} p={[0, 0, 4]} borderRadius={8} color={'white'} overflow={'hidden'} align={'flex-start'}
            // direction={['column', 'column', 'row']}
        >
            {/* Customer Logo Upload */}
            <FormControl w={['100px', '175px']} h={'100px'} aspectRatio={1} borderRadius={'full'}>
                <Box
                    position="relative"
                    w={['100px', '175px']}
                    h={'100px'}
                    overflow="hidden"
                    _hover={{'.overlay': {opacity: allowedToUploadPhoto ? 1 : 0}}} // Only show overlay if upload is allowed
                >
                    <Image
                        w={['100px', '175px']}
                        h={'100px'}
                        objectFit={'scale-down'}
                        src={customer.imageUrl}
                        alt={customer.name}
                        borderRadius={'lg'}
                        fallback={
                            <Flex
                                align={'center'}
                                justify={'center'}
                                w={['100px', '175px']}
                                h={'100px'}
                                bg="gray.200"
                                cursor={allowedToUploadPhoto ? 'pointer' : 'default'} // Allow pointer only if upload is allowed
                            >
                                <Text color="gray.500" m={'auto'} fontSize={'xx-large'}>
                                    {customer.name[0]}
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
                            bg="rgba(0, 0, 0, 0.5)" // Optional: Add a background overlay during uploading
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
                        onChange={handleFileChange}
                        disabled={isUploading}
                        display="none"
                    />
                )}
            </FormControl>

            {/* Customer Details */}
            <VStack align="start" ml={4}>
                <Flex alignItems="center" gap={2}>
                    <Box
                        w={'1.4rem'}
                        h={'1.4rem'}
                        borderRadius="full"
                        border={'white 1px solid'}
                        bg={customer.isActive ? 'green.500' : 'red.500'}
                    />
                    <Heading fontWeight={300} size={['md', 'md', 'lg']}>{customer.name}</Heading>
                </Flex>
                {customer.webAddress &&
                    <Flex direction={'row'} justify={'center'} align={'flex-start'} gap={2}>
                        <LanguageIcon/>
                        <Text
                            as="a"
                            fontSize="sm"
                            target="_blank"
                            rel="noopener noreferrer"
                            href={customer.webAddress.startsWith('http') ? customer.webAddress : `https://${customer.webAddress}`}
                            _hover={{textDecoration: 'underline'}}
                        >
                            {customer.webAddress}
                        </Text>
                    </Flex>
                }
                {customer.address1 && (
                    <Flex direction={'row'} justify={'center'} align={'flex-start'} gap={2}>
                        <LocationOnOutlinedIcon/>
                        <Text
                            fontSize="sm">{customer.address1}, {customer.address2}, {customer.address3}, {customer.address4}, {customer.postcode}</Text>
                    </Flex>
                )}
            </VStack>

            {/* Customer ID */}
            <VStack ml={'auto'} alignItems={'end'} justifyContent={'flex-start'} display={['none', 'none', 'flex']}>
                <Heading size={['md', 'md', 'lg']} fontWeight={100}>ID: {customer.id}</Heading>
                <Flex direction={'row'} justify={'center'} align={'center'} gap={2}>
                    <CreateIcon/>
                    <Text fontSize="sm">{moment(customer.createdAt).format('D/MM/YYYY')}</Text>
                </Flex>
                <Flex direction={'row'} justify={'center'} align={'center'} gap={2}>
                    <UpdateIcon/>
                    <Text fontSize="sm">{moment(customer.updatedAt).format('D/MM/YYYY')}</Text>
                </Flex>
            </VStack>
        </Flex>
    );
};