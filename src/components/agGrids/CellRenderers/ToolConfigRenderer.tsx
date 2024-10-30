'use client'

import React from 'react';
import {Box, Flex, Image, Text} from "@chakra-ui/react";
import Link from "next/link";
import {CustomCellRendererProps} from 'ag-grid-react';

// Define the interface for the component's props
interface ToolConfigRendererProps extends CustomCellRendererProps {
    uniqueIdField: string;  // Field name for dynamic User Unique ID
    imageUrlField: string;  // Field name for dynamic Image URL
    nameField: string;  // Field name for dynamic Full Name
}

const ToolConfigRenderer: React.FC<ToolConfigRendererProps> = ({
                                                                   node,
                                                                   uniqueIdField,
                                                                   imageUrlField,
                                                                   nameField,
                                                               }) => {

    if (!node.data) {
        return null;
    }

    // Access fields dynamically using the provided field names
    const uniqueId = node.data[uniqueIdField];
    const imageUrl = node.data[imageUrlField];
    const fullName = node.data[nameField] ?? 'No Name';

    // Conditionally create a link only if uniqueId exists
    const link = uniqueId ? `/tools/${uniqueId}` : null;

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
                        fallbackSrc="blank-profile-picture.webp"
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
                    <Image
                        alt={fullName}
                        src={'blank-profile-picture.webp'}
                        height="80%"
                        aspectRatio={1}
                        borderRadius="50%"
                        objectFit="cover"
                        boxShadow="md"
                        fallbackSrc="blank-profile-picture.webp"
                    />
                </Box>
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

export default ToolConfigRenderer;
