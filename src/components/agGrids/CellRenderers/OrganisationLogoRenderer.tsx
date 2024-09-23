'use client';

import React from 'react';
import {Box, Image, Text, Flex} from '@chakra-ui/react';
import {MdBusiness} from 'react-icons/md';
import Link from 'next/link';

// Define the interface for organisation data
interface Organisation {
    id: number
    name: string;
    logoUrl?: string; // Optional property
}

// Define the interface for the props expected by the component
interface OrganisationLogoRendererProps {
    data: Organisation; // Organisation data is required
}

const OrganisationLogoRenderer: React.FC<OrganisationLogoRendererProps> = (props) => {
    const {data: organisation} = props;

    if (!organisation) {
        return null;
    }


    const {name, logoUrl} = organisation;
    const link = `/organisations/${organisation.id}`;

    return (
        <Link href={link} passHref>
            <Flex alignItems="center" as={'a'} justifyContent="flex-start" w="full" h="full" maxW="full" gap={4}>
                {logoUrl ? (
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
                            src={logoUrl}
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
                        <MdBusiness size="30px"/>
                    </Box>)}
                <Text fontSize={'14px'} fontWeight="medium" flex={1} overflow="hidden" textOverflow="ellipsis"
                      whiteSpace="nowrap">
                    {name}
                </Text>
            </Flex>
        </Link>
    );
};

export default OrganisationLogoRenderer;
