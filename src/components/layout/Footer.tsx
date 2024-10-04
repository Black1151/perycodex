import { HStack, Text } from "@chakra-ui/react";

export const Footer = () => {
  return (
    <HStack
      justifyContent="center"
      alignItems="center"
      width="100%"
      borderTop="white 1px solid"
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      display={["none", "flex"]}
    >
      <HStack color="white" py={2} px={5} fontSize={18}>
        <Text>Powered by</Text>
        <Text fontFamily="Bonfire" pt={2}>
          Perygon
        </Text>
        <Text>Copyright © 2024</Text>
      </HStack>
    </HStack>
  );
};
