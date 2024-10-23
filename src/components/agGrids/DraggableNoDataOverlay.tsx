import React from 'react';
import { Flex, Icon, Text, VStack } from "@chakra-ui/react";
import { FiInbox } from "react-icons/fi";

interface NoDataOverlayProps {
    gridType: 'population' | 'sample'; // Define the possible grid types
}

const NoDataOverlay: React.FC<NoDataOverlayProps> = ({ gridType }) => {
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
                <Icon as={FiInbox} boxSize={20} color="white" />
                <Text fontSize="2xl" fontWeight="bold" color="white" fontFamily="heading">
                    {gridType === 'population' ? 'No population data available...' : 'No sample data available...'}
                </Text>
                <Text fontSize="lg" color="white" textAlign="center" fontFamily="body">
                    {gridType === 'population'
                        ? 'Drag items from the sample grid over to here.'
                        : 'Drag items from the population grid over to here.'}
                </Text>
            </VStack>
        </Flex>
    );
};

export default NoDataOverlay;
