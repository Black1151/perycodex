import React from 'react';
import {Flex, Icon, Text, VStack, Button} from "@chakra-ui/react";
import {FiInbox} from "react-icons/fi";
import {useRouter} from 'next/navigation';

interface NoDataOverlayProps {
    url?: string | null;
}

const NoDataOverlay: React.FC<NoDataOverlayProps> = ({url}) => {
    const router = useRouter();

    const handleCreateNew = () => {
        if (url) {
            router.push(url); // Redirect to the provided URL
        }
    };

    return (
        <Flex
            direction="column"
            align="center"
            justify="center"
            width="full"
            py={20}
            px={5}
            shadow={'md'}
            bg="background_200"  // Subtle background to differentiate from main content
            borderRadius="md"  // Rounded corners
        >
            <VStack spacing={4}>
                <Icon as={FiInbox} boxSize={20} color="primary"/>
                <Text fontSize="2xl" fontWeight="bold" color="text">No Data Available</Text>
                <Text fontSize="lg" color="text" textAlign="center">
                    It looks like there is nothing to display at the moment. Once data is available, it will
                    appear here.
                </Text>
                {url && (
                    <Button
                        onClick={handleCreateNew}
                        background='primary'
                        color='white'
                        _hover={{color: 'primary', background: 'white', borderColour: 'primary', border: '1px solid'}}
                        mt={4}
                    >
                        Create New Record
                    </Button>
                )}
            </VStack>
        </Flex>
    );
}

export default NoDataOverlay;
