import { Flex, Text, theme, useTheme } from "@chakra-ui/react";

interface SectionHeaderProps {
  children: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ children }) => {
  const theme = useTheme();

  return (
    <Flex
      bg="rgba(0, 0, 0, 0.5)"
      p={2}
      px={4}
      borderRadius="xl"
      justifyContent="center"
      backgroundColor="white"
    >
      <Text color={theme.colors.perygonPink} fontSize={["sm", "lg"]}>
        {children}
      </Text>
    </Flex>
  );
};
