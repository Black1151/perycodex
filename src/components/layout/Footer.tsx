import {Box, HStack, Text, useTheme} from "@chakra-ui/react";

export const Footer = () => {
    const theme = useTheme();
    return (
        <Box
            justifyContent="center"
            alignItems="center"
            position="fixed"
            bottom={0}
            left={0}
            right={0}
            width="100%"
            height={30}
            borderTop="white 1px solid"
            display={["none", "flex"]}
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
