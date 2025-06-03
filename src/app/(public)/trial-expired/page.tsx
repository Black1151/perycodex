"use client";

import { Box, Button, Center, Code, Text, VStack, useTheme } from "@chakra-ui/react";
import { SpringScale } from "@/components/animations/SpringScale";
import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";

export default function TrialExpiredPage() {
  const theme = useTheme();

  return (
    <Center flex={1} h="100vh" position="relative" overflow="hidden" bg={theme.colors.seduloRed}>
      <SpringScale>
        <VStack
          bg="white"
          p={10}
          borderRadius="3xl"
          boxShadow="2xl"
          spacing={10}
          align="center"
          justify="center"
          maxW="2xl"
          mx="auto"
        >
          <Box position="relative" textAlign="center">
            <LetterFlyIn color={theme.colors.primary} fontSize={68}>
              Trial Expired
            </LetterFlyIn>
            <Text
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="bold"
              mt={-2}
              color="gray.700"
              textShadow="1px 1px 2px rgba(0,0,0,0.2)"
            >
              Your access has ended.
            </Text>
          </Box>

          <Text fontSize="lg" textAlign="center" color="gray.500" maxW="md">
            Your trial period has expired. Please contact your admin team for further assistance or to renew your access.
          </Text>
        </VStack>
      </SpringScale>
    </Center>
  );
}
