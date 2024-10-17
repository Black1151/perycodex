'use client';

import {Heading, Modal, ModalBody, ModalContent, ModalOverlay} from "@chakra-ui/react";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {inviteUserJson} from "@/components/surveyjs/forms/inviteUser";

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
                <ModalBody>
                    <Heading>New User</Heading>
                    {/* Render the SurveyComponent with an onComplete handler */}
                    <SurveyComponent
                        surveyJson={inviteUserJson}
                        endpoint={'/registerByInvite'}
                        isNew={true}
                        layout={'default'}
                        sjsPath={'admin'}
                        onSurveySuccess={handleSurveyComplete}
                        layoutOptions={{showTopNavigation: false, showBottomNavigation: true}}
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default InviteNewUserModalForPA;
