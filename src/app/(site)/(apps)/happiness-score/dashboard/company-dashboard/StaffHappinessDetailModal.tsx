import React from "react";
import LineGraph from "@/components/graphs/LineGraph";
import SpeechBubble from "@/app/(site)/(apps)/happiness-score/SpeechBubble";
import {
  Avatar,
  Box,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { perygonTheme } from "@/theme/theme";

interface StaffHappinessDetailModalProps {
  averagehappiness: string;
  firstname: string;
  historicrecords: string;
  imageurl: string | null;
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

  const graphHeight = useBreakpointValue({ base: 150, md: 300 });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent
        mx={0}
        px={0}
        bgGradient={perygonTheme.gradients.perygonBackground}
      >
        <ModalHeader color="white">{`${firstname}'s Happiness`}</ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody mx={0} px={0}>
          <Flex
            flexDirection={["column", null, null, "row"]}
            p={4}
            borderRadius="md"
            width="100%"
            gap={10}
          >
            <VStack minWidth={[250, null, 400]} maxWidth={420}>
              <Flex justifyContent="flex-start" width="100%">
                <Box w={[200, null, 300]}>
                  <SpeechBubble
                    score={parseFloat(averagehappiness)}
                    change={0}
                    positiveChange={true}
                  />
                </Box>
              </Flex>
              <HStack
                minWidth={[200, null, 300]}
                w="100%"
                gap={8}
                justifyContent="space-between"
                pl={6}
              >
                <Text fontSize={["xl", "3xl"]} fontWeight="bold" color="white">
                  {firstname} {lastname}
                </Text>
                {imageurl ? (
                  <Avatar
                    src={imageurl}
                    name={`${firstname} ${lastname}`}
                    size="2xl"
                  />
                ) : (
                  <Avatar name={`${firstname} ${lastname}`} size="2xl" />
                )}
              </HStack>
            </VStack>
            <VStack w="100%">
              <LineGraph DataPoints={dataPoints} graphHeight={graphHeight} />
            </VStack>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default StaffHappinessDetailModal;
