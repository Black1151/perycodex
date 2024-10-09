'use client';

import React from 'react';
import {Box, Image, Text, Flex} from '@chakra-ui/react';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import Link from 'next/link';

// Define the interface for customer data
interface Customer {
    uniqueId: string
    name: string;
    imageUrl: string;
}

// Define the interface for the props expected by the component
interface CustomerLogoRendererProps {
    data: Customer; // Customer data is required
}

const CustomerLogoRenderer: React.FC<CustomerLogoRendererProps> = (props) => {
    const {data: customer} = props;

    if (!customer) {
        return null;
    }


    const {name, imageUrl, uniqueId} = customer;
    const link = `/customers/${uniqueId}`;

    return (
        <Link href={link} passHref>
            <Flex alignItems="center" as={'a'} justifyContent="flex-start" w="full" h="full" maxW="full" gap={4}>
                {imageUrl ? (
                    <Box
                        flexShrink={0}
                        width="50px"
                        height="50px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        padding={1}
                    >
                        <Image
                            src={imageUrl}
                            alt={name}
                            maxW="100%"
                            maxH="100%"
                            objectFit="contain"
                            fallbackSrc="https://via.placeholder.com/50"
                        />
                    </Box>
                ) : (
                    <Box
                        flexShrink={0}
                        width="50px"
                        height="50px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <BusinessOutlinedIcon/>
                    </Box>)}
                <Text fontSize={'14px'} flex={1} overflow="hidden" textOverflow="ellipsis"
                      whiteSpace="nowrap">
                    {name}
                </Text>
            </Flex>
        </Link>
    );
};

export default CustomerLogoRenderer;
