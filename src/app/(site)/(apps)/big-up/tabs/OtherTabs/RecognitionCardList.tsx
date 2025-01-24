import React from "react";
import {
  Box,
  Text,
  Avatar,
  Stack,
  Flex,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";

export interface RecognitionItem {
  id: string;
  name: string;
  recognizedBy: string;
  message: string;
  date: string;
  avatarUrl?: string;
  badge?: string;
}

interface RecognitionListProps {
  items: RecognitionItem[];
}

export const RecognitionList: React.FC<RecognitionListProps> = ({ items }) => {
  return (
    <Stack spacing={4} bg={"white"} p={4} rounded="md">
      {items.map((item) => (
        <Box key={item.id} bg={"white"} boxShadow="md" p={4} rounded="md">
          <Flex align="center" mb={2}>
            <Avatar size="md" name={item.name} src={item.avatarUrl} mr={3} />
            <Box flex="1">
              <Heading as="h3" size="sm">
                {item.name}

                <Text as="span" fontWeight="normal">
                  has been recognised by {item.recognizedBy}
                </Text>
              </Heading>
              {item.badge && (
                <Text fontSize="xs" color="teal.500" fontWeight="bold">
                  {item.badge}
                </Text>
              )}
            </Box>
            <Box>
              <Text fontSize="xs" color="gray.600">
                {item.date}
              </Text>
            </Box>
          </Flex>
          <Text fontSize="sm">{item.message}</Text>
        </Box>
      ))}
    </Stack>
  );
};
