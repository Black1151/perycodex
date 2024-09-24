import React from 'react';
import { Box, Image, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { MdBusiness } from "react-icons/md";

// Define the interface for organisation data
interface Organisation {
    id: string;
    name: string;
    logoUrl?: string;
}

// Define the interface for the props expected by the component
interface OrganisationLinkRendererProps {
    data: {
        organisation?: Organisation; // Optional chaining in case organisation is not present
    };
}

const OrganisationLinkRenderer: React.FC<OrganisationLinkRendererProps> = (props) => {
    const { data } = props;
    const organisation = data.organisation;

    if (!organisation) {
        return null; // Return null if no organisation is provided
    }

    const {name, logoUrl } = organisation;
    const link = `/organisations/${organisation.id}`;

    return (
        <Box w="full" h="full" py={2}>
            <Link href={link} passHref>
                <Box
                    as="a"
                    display="flex"
                    alignItems="center"
                    gap={3}
                    w="full"
                    h="full"
                    p={2}
                    borderRadius="md"
                    _hover={{ bg: "gray.100", textDecoration: 'none' }}
                    transition="background-color 0.2s ease"
                >
                    {logoUrl ? (
                        <Box
                            flexShrink={0}
                            width="40px"
                            height="40px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            bg="white"
                            borderRadius="md"
                            overflow="hidden"
                            boxShadow="sm"
                        >
                            <Image
                                src={logoUrl}
                                alt={name}
                                maxW="100%"
                                maxH="100%"
                                objectFit="contain"
                                fallbackSrc="https://via.placeholder.com/40"
                            />
                        </Box>
                    ) : (
                        <Box
                            flexShrink={0}
                            width="40px"
                            height="40px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            bg="gray.200"
                            borderRadius="md"
                        >
                            <MdBusiness size="24px" color="gray.600" />
                        </Box>
                    )}
                    <Text
                        fontSize={'14px'}
                        fontWeight="medium"
                        flex={1}
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        color="gray.700"
                    >
                        {name}
                    </Text>
                </Box>
            </Link>
        </Box>
    );
};

export default OrganisationLinkRenderer;
