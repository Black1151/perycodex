"use client";

import {
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import React from "react";
import { assignGroupJson } from "@/components/surveyjs/forms/assignGroup";

interface AssignGroupModalProps {
  isOpen: boolean; // Controls modal visibility
  onClose: () => void; // Handler to close the modal
}

const AssignGroupModal = ({ isOpen, onClose }: AssignGroupModalProps) => {
  // Function to handle the form completion event
  const handleSurveySuccess = () => {
    onClose(); // Close the modal after survey success
  };

  const handleSurveyFailure = () => {
    onClose(); // Close the modal after survey failure
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader paddingBottom={0}>
          <Flex justifyContent={"center"} alignItems={"center"} width={"100%"}>
            Assign User Groups
          </Flex>
        </ModalHeader>
        <ModalBody>
          <SurveyComponent
            surveyJson={assignGroupJson}
            endpoint={"/assignUserGroups"}
            isNew={true}
            layout={"default"}
            sjsPath={"admin"}
            onSurveySuccess={handleSurveySuccess}
            surveySuccessMessage={"Groups assigned successfully"}
            onSurveyFailure={handleSurveyFailure}
            layoutOptions={{
              showTopNavigation: false,
              showBottomNavigation: true,
            }}
            reloadPageOnSuccess={true} // Reload page after success if required
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AssignGroupModal;
