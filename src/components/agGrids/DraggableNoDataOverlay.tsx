import React from 'react';
import {Flex, Icon, Text, VStack, Button} from "@chakra-ui/react";
import {FiInbox} from "react-icons/fi";
import {useRouter} from 'next/navigation';



const NoDataOverlay: React.FC = () => {
    const router = useRouter();

    return (
        <Flex
            direction="column"
            align="center"
            justify="center"
            py={20}
            px={5}
            width="100%"
            height="100%"
            borderRadius="md"
        >
            <VStack spacing={4}>
                <Icon as={FiInbox} boxSize={20} color="white"/>
                <Text fontSize="2xl" fontWeight="bold" color="white" fontFamily="heading">
                    No selections just yet...
                </Text>
                <Text fontSize="lg" color="white" textAlign="center" fontFamily="body">
                    Drag Items from the left over to here
                </Text>
            </VStack>
        </Flex>
    );
}

export default NoDataOverlay;
