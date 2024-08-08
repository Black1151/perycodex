import { Flex, Text } from "@chakra-ui/react";

interface SectionHeaderProps {
  children: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ children }) => {
  return (
    <Flex
      bg="rgba(0, 0, 0, 0.5)"
      p={2}
      px={4}
      borderRadius="xl"
      justifyContent="center"
    >
      <Text fontSize="xs" color="white">
        {children}
      </Text>
    </Flex>
  );
};
