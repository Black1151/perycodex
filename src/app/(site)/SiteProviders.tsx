'use client';

import {ReactNode, useState} from "react";
import {UserContextProps, UserProvider, useUser} from "@/providers/UserProvider";
import {WorkflowProvider} from "@/providers/WorkflowProvider";
import {
    Box,
    Flex,
    IconButton,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text
} from "@chakra-ui/react";
import {Person} from "@mui/icons-material";

interface ClientUserProviderProps {
    children: ReactNode;
    userMetadata: UserContextProps;
}

export default function SiteProviders({
                                          children,
                                          userMetadata,
                                      }: ClientUserProviderProps) {
    return (
        <UserProvider value={userMetadata}>
            <WorkflowProvider>
                {children}
                {process.env.NODE_ENV === "development" && <UserModal userMetadata={userMetadata}/>}
            </WorkflowProvider>
        </UserProvider>
    );
}

// UserModal component with Person icon and modal for displaying user data
const UserModal = ({userMetadata}: { userMetadata: UserContextProps }) => {
    const {user} = useUser();
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    return (
        <>
            {/* Icon button to open the modal */}
            <IconButton
                aria-label="Open user details"
                icon={<Person/>}
                onClick={handleOpen}
                position="fixed"
                bottom="20px"
                right="20px"
                zIndex={1000}
                colorScheme="teal"
                size="lg"
                borderRadius="full"
            />

            {/* Modal to display user data side by side */}
            <Modal isOpen={isOpen} onClose={handleClose} size="3xl">
                <ModalOverlay/>
                <ModalContent maxH={'80%'} overflow={'auto'}>
                    <ModalHeader>User Information</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <Flex gap={6}>
                            {/* User Context Data */}
                            <Box flex="1" p={4} bg="gray.50" borderRadius="md">
                                <Text fontWeight="bold" mb={2}>User Context</Text>
                                <Box as="pre" fontSize="sm" whiteSpace="pre-wrap" wordBreak="break-word">
                                    {JSON.stringify(user, null, 2)}
                                </Box>
                            </Box>

                            {/* User Metadata Data */}
                            <Box flex="1" p={4} bg="gray.50" borderRadius="md">
                                <Text fontWeight="bold" mb={2}>User Metadata</Text>
                                <Box as="pre" fontSize="sm" whiteSpace="pre-wrap" wordBreak="break-word">
                                    {JSON.stringify(userMetadata, null, 2)}
                                </Box>
                            </Box>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};
