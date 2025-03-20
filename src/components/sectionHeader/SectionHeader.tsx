import { Flex, Text, theme, useTheme } from "@chakra-ui/react";

interface SectionHeaderProps {
  children: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ children }) => {
  const theme = useTheme();

  return (
    <Flex
      p={2}
      px={4}
      borderRadius="xl"
      justifyContent="center"
      backgroundColor="elementBG"
    >
      <Text color={theme.colors.primary} fontSize={["sm", "lg"]}>
        {children}
      </Text>
    </Flex>
  );
};
