import { Box, HStack, Text, useTheme } from "@chakra-ui/react";

export const Footer = () => {
  const theme = useTheme();
  return (
    <Box
      position="absolute"
      justifyContent="center"
      alignItems="center"
      width="100%"
      maxHeight={30}
      borderTop="white 1px solid"
      bottom={0}
      left={0}
      right={0}
      display={["none", "flex"]}
      overflow="hidden"
      bgGradient={`linear(to-br, ${theme.colors.seduloRed}, ${theme.colors.perygonPink})`}
    >
      <HStack color="white" py={2} px={5} fontSize={18}>
        <Text>Powered by</Text>
        <Text fontFamily="Bonfire" pt={2}>
          Perygon
        </Text>
        <Text>Copyright © 2024</Text>
      </HStack>
    </Box>
  );
};
