'use client';

import {Flex, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay} from "@chakra-ui/react";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {inviteUserJson} from "@/components/surveyjs/forms/inviteUser";
import React from "react";

interface InviteNewUserModalForPAProps {
    isOpen: boolean;  // Controlled by the parent
    onClose: () => void;  // Close handler passed by parent
}

const InviteNewUserModalForPA = ({isOpen, onClose}: InviteNewUserModalForPAProps) => {
    // Function to handle the form completion event
    const handleSurveyComplete = () => {
        onClose();  // Close the modal after survey completion
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent={'center'} alignItems={'center'} width={'100%'}>
                        Invite New User
                    </Flex>
                </ModalHeader>
                <ModalBody>
                    <SurveyComponent
                        surveyJson={inviteUserJson}
                        endpoint={'/registerByInvite'}
                        isNew={true}
                        layout={'default'}
                        sjsPath={'admin'}
                        onSurveySuccess={handleSurveyComplete}
                        layoutOptions={{showTopNavigation: false, showBottomNavigation: true}}
                        reloadPageOnSuccess={true}
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default InviteNewUserModalForPA;
