import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    VStack,
    Box,
    Text,
    Skeleton,
    useTheme,
    Spinner,
    HStack,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from '@chakra-ui/react';
import { ToolResource } from './types';
import { ToolPurchasePanel } from './ToolPurchasePanel';
import { useBasketContext } from './BasketContext';

interface ToolModalProps {
    isOpen: boolean;
    onClose: () => void;
    tool: ToolResource;
}


export function ToolModal({ isOpen, onClose, tool }: ToolModalProps) {
    const basket = useBasketContext();
    const theme = useTheme();

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
            <ModalOverlay />
            <ModalContent p={0}>
                <>
                    <ModalCloseButton />
                    <ModalBody p={0} borderRadius={"md"} overflow={"hidden"}>
                        <VStack spacing={4} align="start">
                            <HStack spacing={[0, 6, 12]} bg={theme.colors.darkGray} p={4} w={"full"}>
                                <img
                                    src={tool.logoImageUrl}
                                    alt={tool.displayName}
                                    style={{ objectFit: 'contain', width: '200px' }}
                                />
                            </HStack>
                            <Tabs
                                variant="line"
                                width="100%"
                                px={4}
                                pb={8}
                            >
                                <TabList color={theme.colors.primaryTextColour} borderRadius="md" mb={4}>
                                    <Tab>Features</Tab>
                                    <Tab>Demo</Tab>
                                    <Tab>Pricing</Tab>
                                    <Tab>Reviews</Tab>
                                </TabList>

                                <TabPanels>
                                    {/* All Tools */}
                                    <TabPanel p={0}>
                                        <Text>{tool.previewText}</Text>
                                    </TabPanel>
                                    <TabPanel p={0}>
                                        <Text>Tool Demos Here Potentially</Text>
                                    </TabPanel>
                                    <TabPanel p={0}>
                                        <ToolPurchasePanel
                                            item={tool}               // from useBasket().items.find(...)
                                            isTrialable={tool.isTrial}
                                            addTool={basket.addToolToSelection}         
                                            removeTool={basket.removeToolFromSelection}   
                                        />
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </VStack>
                    </ModalBody>
                </>
            </ModalContent>
        </Modal >
    );
}
