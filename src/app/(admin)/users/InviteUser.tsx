'use client';

import {Modal, ModalBody, ModalContent, ModalOverlay} from "@chakra-ui/react";
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
        console.log('Survey completed!');
        onClose();  // Close the modal after survey completion
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalBody>
                    <h2>Invite New User (PA)</h2>
                    {/* Render the SurveyComponent with an onComplete handler */}
                    <SurveyComponent
                        surveyJson={inviteUserJson}
                        endpoint={'/registerByInvite'}
                        isNew={true}
                        layout={'default'}
                        sjsPath={'admin'}
                        onSurveyComplete={handleSurveyComplete}  // Handle completion
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default InviteNewUserModalForPA;
