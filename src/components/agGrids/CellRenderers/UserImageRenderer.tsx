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
    id: number;
    userUniqueId: string;
    fullName?: string
    email?: string,
    role?: string,
    jobTitle?: string,
    imageUrl?: string,
    custName?: string,
    siteName?: string,
    isActive?: boolean
}

const UserImageRenderer: React.FC<UserImageRendererProps> = (props) => {
    const {data: contact} = props;

    if (!contact) {
        return null;
    }

    const {userUniqueId, imageUrl, fullName} = contact;

    const link = userUniqueId ? `/users/${userUniqueId}` : null;


    const userContent = (
        <Flex alignItems="center" textDecoration="none" justifyContent="flex-start" height="100%" width="100%" py={1}
              gap={2}>
            <Image
                alt={`${fullName}`}
                src={
                    imageUrl && imageUrl !== ""
                        ? imageUrl
                        : "blank-profile-picture.webp"
                }
                height="100%"
                aspectRatio={1}
                borderRadius="50%"
                objectFit={'cover'}
                boxShadow="md"
                fallbackSrc={"blank-profile-picture.webp"}
            />
            <Text fontSize={'14px'}>
                {fullName}
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
