import React, {useState} from 'react';
import {Box, Flex, Switch, Icon, useColorModeValue} from '@chakra-ui/react';

interface CustomToggleProps {
    iconA: React.ElementType; // Icon for state A
    iconB: React.ElementType; // Icon for state B
    isChecked: boolean; // Current state of the switch
    onToggle: () => void; // Function to handle the toggle action
}

const CustomToggle: React.FC<CustomToggleProps> = ({iconA, iconB, isChecked, onToggle}) => {
    const bgColor = useColorModeValue('gray.200', 'gray.700');
    const activeColor = useColorModeValue('perygonPink', 'blue.300');

    return (
        <Flex alignItems="center">
            <Box
                as="label"
                display="flex"
                alignItems="center"
                cursor="pointer"
                position="relative"
                width="80px"
                height="40px"
                bg={bgColor}
                borderRadius="full"
                padding="2px"
                transition="background-color 0.2s"
                _focus={{boxShadow: 'outline'}}
            >
                <Switch
                    isChecked={isChecked}
                    onChange={onToggle}
                    size="md"
                    position="absolute"
                    opacity={0}
                    width="100%"
                    height="100%"
                    zIndex={2}
                />
                <Box
                    position="absolute"
                    top="50%"
                    left={isChecked ? 'calc(100% - 36px)' : '2px'}
                    transform="translateY(-50%)"
                    width="36px"
                    height="36px"
                    borderRadius="full"
                    bg={activeColor}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    transition="all 0.4s"
                >
                    <Icon as={isChecked ? iconB : iconA} color="white" boxSize={4}/>
                </Box>
            </Box>
        </Flex>
    );
};

export default CustomToggle;
