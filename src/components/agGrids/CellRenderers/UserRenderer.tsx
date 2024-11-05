'use client'

import React from 'react';
import {Box, Flex, Image, Text} from "@chakra-ui/react";
import Link from "next/link";
import {CustomCellRendererProps} from 'ag-grid-react';
import {Person} from "@mui/icons-material";

// Define the interface for the component's props
interface UserRendererProps extends CustomCellRendererProps {
    uniqueIdField: string;  // Field name for dynamic User Unique ID
    imageUrlField: string;  // Field name for dynamic Image URL
    nameField: string;  // Field name for dynamic Full Name
    contact?: Contact;  // Optional contact object
}

interface Contact {
    [key: string]: any;  // Support dynamic fields in contact object
}

const UserRenderer: React.FC<UserRendererProps> = ({
                                                       data: contact,
                                                       uniqueIdField,
                                                       imageUrlField,
                                                       nameField,
                                                   }) => {

    if (!contact) {
        return null;
    }

    // Access fields dynamically using the provided field names
    const uniqueId = contact[uniqueIdField];
    const imageUrl = contact[imageUrlField];
    const fullName = contact[nameField] ?? 'No Name';

    // Conditionally create a link only if uniqueId exists
    const link = uniqueId ? `/users/${uniqueId}` : null;

    // Common content to display user information
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
                        alt={fullName}
                        src={imageUrl}
                        height="80%"
                        aspectRatio={1}
                        borderRadius="50%"
                        objectFit="cover"
                        boxShadow="md"
                    />
                </Box>
            ) : (
                <Flex width={'50px'} height={'full'} align={'center'} justify={'center'}>
                    <Box
                        flexShrink={0}
                        height="80%"
                        aspectRatio={1}
                        display="flex"
                        alignItems="center"
                        borderRadius={'full'}
                        bg={'gray.100'}
                        justifyContent="center"
                    >
                        <Person sx={{color: "var(--chakra-colors-perygonPink)"}}/>
                    </Box>
                </Flex>
            )}
            <Text fontSize={'14px'} flex={1} overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                {fullName}
            </Text>
        </Flex>
    );

    // Conditionally render the content inside a Link if uniqueId is present
    return link ? (
        <Link href={link}>
            {content}
        </Link>
    ) : (
        content
    );
};

export default UserRenderer;
