'use client'

import React from 'react';
import {Box, Flex, Text} from "@chakra-ui/react";
import Link from "next/link";
import {CustomCellRendererProps} from 'ag-grid-react';
import {MailLock} from "@mui/icons-material";

// Define the interface for the component's props
interface EmailSecureLinkRendererProps extends CustomCellRendererProps {
    nameField: string;  // Field name for dynamic Site Name
    uniqueIdField: string;  // Field name for dynamic Site Unique ID
}

const EmailSecureLinkRenderer: React.FC<EmailSecureLinkRendererProps> = ({
                                                                             node,
                                                                             nameField,
                                                                             uniqueIdField,
                                                                         }) => {

    const emailSecureLink = node?.data;

    if (!emailSecureLink) {
        return null;
    }

    // Access fields dynamically using the provided field names
    const emailSecureLinkName = emailSecureLink[nameField] ?? 'No Secure Link';
    const uniqueId = emailSecureLink[uniqueIdField];

    // Conditionally create a link only if uniqueId exists
    const link = uniqueId ? `/email-secure-link/${uniqueId}` : null;

    // Render the emailSecureLink name as text (inside a link if the emailSecureLink has a unique ID)
    const content = (
        <Flex alignItems="center" justifyContent="flex-start" w="full" h="full" maxW="full" gap={2}>
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
                <MailLock sx={{color: "var(--chakra-colors-perygonPink)"}}/>
            </Box>
            <Text fontSize={'14px'} flex={1} overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                {emailSecureLinkName}
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

export default EmailSecureLinkRenderer;
