'use client'

import {CustomCellRendererProps} from 'ag-grid-react';
import React from 'react';
import {Flex, Image, Text, Box} from "@chakra-ui/react";
import {FaUser} from "react-icons/fa";
import Link from "next/link";

interface UserImageRendererProps extends CustomCellRendererProps {
    contact?: Contact;  // Made optional, in case contact may not always exist
}

interface Contact {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    number: string;
    email_verified_at: string;
    isActive: boolean;
    userTypeId: number;
    organisationId: number;
    photoUrl: string | null;
    created_at: string;
    updated_at: string;
}

const UserImageRenderer: React.FC<UserImageRendererProps> = (props) => {
    const {contact} = props;

    if (!contact) {
        return <Text>N/A</Text>; // Fallback if no contact is passed
    }

    const link = contact.id ? `/users/${contact.id}` : null;

    const userContent = (
        <Flex alignItems="center" textDecoration="none" justifyContent="flex-start" height="100%" width="100%" py={1}
              gap={2}>
            {contact.photoUrl ? (
                <Image
                    alt={`${contact.firstName} ${contact.lastName}`}
                    src={contact.photoUrl}
                    height="100%"
                    aspectRatio={1}
                    borderRadius="50%"
                    boxShadow="md"
                />
            ) : (
                <Box height={'100%'} aspectRatio={1} borderRadius={'50%'}>
                    <FaUser size={'100%'}/>
                </Box>
            )}
            <Text fontSize={'14px'}>
                {contact.firstName} {contact.lastName}
            </Text>
        </Flex>
    );

    return link ? (
        <Link href={link} passHref>{userContent}</Link>
    ) : (
        userContent
    );
};

export default UserImageRenderer;
