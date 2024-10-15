'use client';

import React from 'react';
import {Box, Image, Text, Flex} from '@chakra-ui/react';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import Link from 'next/link';
import {CustomCellRendererProps} from "ag-grid-react";

// Define the interface for the props expected by the component
interface CustomerLogoRendererProps extends CustomCellRendererProps {
    imageUrlField: string; // Field name for dynamic Image Url
    idField: string; // Field name for dynamic ID
    nameField: string; // Field name for dynamic Name
}

const CustomerLogoRenderer: React.FC<CustomerLogoRendererProps> = ({
                                                                       node,
                                                                       nameField,
                                                                       idField,
                                                                       imageUrlField,
                                                                   }) => {
    const customer = node?.data;

    if (!customer) {
        return null;
    }

    const name = customer[nameField] ?? 'No Customer'; // Access the name dynamically using nameField
    const imageUrl = customer[imageUrlField]; // Access the Image dynamically using imageUrlField
    const uniqueId = customer[idField]; // Access the unique ID dynamically using idField

    const link = uniqueId ? `/customers/${uniqueId}` : null;

    // Common content that remains the same, with or without a link
    const content = (
        <Flex alignItems="center" justifyContent="flex-start" w="full" h="full" maxW="full" gap={4}>
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
                </Box>
            )}
            <Text fontSize={'14px'} flex={1} overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                {name}
            </Text>
        </Flex>
    );

    // Conditionally wrap content in Link if a link exists
    return link ? (
        <Link href={link}>
            {content}
        </Link>
    ) : (
        content
    );
};

export default CustomerLogoRenderer;
