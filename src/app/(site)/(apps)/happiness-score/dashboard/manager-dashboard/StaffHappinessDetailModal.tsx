import React from "react";
import LineGraph from "@/components/graphs/LineGraph";
import SpeechBubble from "@/app/(site)/(apps)/happiness-score/SpeechBubble";
import {
  Box,
  HStack,
  Image,
  Text,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Flex,
} from "@chakra-ui/react";
import { perygonTheme } from "@/theme/theme";
import { SectionHeader } from "@/components/sectionHeader/SectionHeader";

interface StaffHappinessDetailModalProps {
  averagehappiness: string;
  firstname: string;
  historicrecords: string;
  imageurl: string;
  lastname: string;
  isOpen: boolean;
  onClose: () => void;
}

const StaffHappinessDetailModal: React.FC<StaffHappinessDetailModalProps> = ({
  averagehappiness,
  firstname,
  historicrecords,
  imageurl,
  lastname,
  isOpen,
  onClose,
}) => {
  const parsedRecords = JSON.parse(historicrecords);

  const dataPoints = parsedRecords.map((record: any) => ({
    value: parseFloat(record.value),
    title: record.title,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent bgGradient={perygonTheme.gradients.perygonBackground}>
        <ModalHeader color="white">{`${firstname}'s Happiness`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack p={4} borderRadius="md" width="100%">
            <VStack w="100%">
              <Flex width="100%" justifyContent="center" mb={4}>
                <SectionHeader>Averaged Happiness Value</SectionHeader>
              </Flex>
              <Flex justifyContent="flex-start" width="100%">
                <Box w={300}>
                  <SpeechBubble
                    score={parseFloat(averagehappiness)}
                    change={0}
                    positiveChange={true}
                  />
                </Box>
              </Flex>
            </VStack>
            <HStack w="100%" gap={8} justifyContent="space-between">
              <Text fontSize="3xl" fontWeight="bold" color="white">
                {firstname} {lastname}
              </Text>
              <Image
                src={imageurl}
                alt={`${firstname} ${lastname}`}
                boxSize="150px"
                borderRadius="full"
              />
            </HStack>
            <Flex width="100%" justifyContent="center" mb={4}>
              <SectionHeader>Hapiness History</SectionHeader>
            </Flex>
            <LineGraph DataPoints={dataPoints} graphHeight={150} />
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default StaffHappinessDetailModal;
