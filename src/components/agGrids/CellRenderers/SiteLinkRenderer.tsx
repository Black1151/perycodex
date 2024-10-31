'use client'

import React from 'react';
import {Flex, Text} from "@chakra-ui/react";
import Link from "next/link";
import {CustomCellRendererProps} from 'ag-grid-react';

// Define the interface for the component's props
interface SiteLinkRendererProps extends CustomCellRendererProps {
    nameField: string;  // Field name for dynamic Site Name
    uniqueIdField: string;  // Field name for dynamic Site Unique ID
}

const SiteLinkRenderer: React.FC<SiteLinkRendererProps> = ({
                                                               data: contact,
                                                               nameField,
                                                               uniqueIdField,
                                                           }) => {

    if (!contact) {
        return null;
    }

    // Access fields dynamically using the provided field names
    const siteName = contact[nameField] ?? 'No Site';
    const uniqueId = contact[uniqueIdField];

    // Conditionally create a link only if uniqueId exists
    const link = uniqueId ? `/sites/${uniqueId}` : null;

    // Render the site name as text (inside a link if the site has a unique ID)
    const content = (
        <Flex alignItems="center" justifyContent="flex-start" w="full" h="full" maxW="full">
            <Text fontSize={'14px'} flex={1} overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                {siteName}
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

export default SiteLinkRenderer;
