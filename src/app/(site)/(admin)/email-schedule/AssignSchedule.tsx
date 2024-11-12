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
import { duplicateCustomerEmailSchedule } from "@/components/surveyjs/forms/duplicateCustomerEmailSchedule";

interface AssignScheduleProps {
  isOpen: boolean; // Controlled by the parent
  onClose: () => void; // Close handler passed by parent
  endpoint: string;
  id: string;
}

const AssignSchedule = ({ isOpen, onClose, id }: AssignScheduleProps) => {
  // Function to handle the form completion event
  const handleSurveySuccess = () => {
    onClose(); // Close the modal after survey success
  };

  // Function to handle the form completion event
  const handleSurveyFailure = () => {
    onClose(); // Close the modal after survey failure
  };

  const data = {
    scheduleId: id,
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader paddingBottom={0}>
          <Flex justifyContent={"center"} alignItems={"center"} width={"100%"}>
            Assign Schedule To Customer
          </Flex>
        </ModalHeader>
        <ModalBody>
          <SurveyComponent
            surveyJson={duplicateCustomerEmailSchedule}
            endpoint={"/createCustomerEmailSchedule"}
            isNew={true}
            dataset={data}
            layout={"default"}
            sjsPath={"admin"}
            onSurveySuccess={handleSurveySuccess}
            onSurveyFailure={handleSurveyFailure}
            layoutOptions={{
              showTopNavigation: false,
              showBottomNavigation: true,
            }}
            reloadPageOnSuccess={true}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AssignSchedule;
