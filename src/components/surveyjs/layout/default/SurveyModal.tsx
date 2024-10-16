import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Button,
    Heading, Flex
} from '@chakra-ui/react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    bodyContent?: string;
    confirmLabel?: string;
    cancelLabel?: string;
}

const SurveyModal: React.FC<ModalProps> = ({
                                               isOpen,
                                               onClose,
                                               onConfirm,
                                               title = "Confirm Action",
                                               bodyContent = "Are you sure you want to perform this action?",
                                               confirmLabel = "Confirm",
                                               cancelLabel = "Cancel",
                                           }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}> {/* 'isCentered' ensures the modal is centered */}
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent={'center'} alignItems={'center'} width={'100%'}>
                        {title}
                    </Flex>
                </ModalHeader>
                <ModalBody>{bodyContent}</ModalBody>
                <ModalFooter>
                    <Button mr={3} onClick={onClose}>{cancelLabel}</Button>
                    <Button colorScheme="green" onClick={onConfirm}>
                        {confirmLabel}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default SurveyModal;
