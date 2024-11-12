"use client";
import { Box, Button, Center, keyframes, Text, VStack } from "@chakra-ui/react";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { SpringScale } from "@/components/animations/SpringScale";
import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Keyframes for subtle background animation
const floatingAnimation = keyframes`
    0% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-10px);
    }
    100% {
        transform: translateY(0px);
    }
`;

export default function NotFoundPage() {
  const router = useRouter();

  const logout = async () => {
    try {
      await fetch("/api/auth/sign-out", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/error");
    }
  };

  return (
    <PerygonContainer>
      {/* Animated background gradient */}
      <Center flex={1} h="100vh" position="relative" overflow="hidden">
        <Box
          position="absolute"
          top="0"
          left="0"
          w="100%"
          h="100%"
          bgGradient="linear(to-br, pink.100, pink.300, purple.200)"
          zIndex={-1}
          opacity={0.3}
          animation={`${floatingAnimation} 6s ease-in-out infinite`}
        />

        <SpringScale>
          <VStack
            bg="white"
            p={10}
            borderRadius="3xl"
            boxShadow="2xl"
            spacing={10}
            align="center"
            justify="center"
            maxW="lg"
            mx="auto"
          >
            {/* 404 Error text with animated effect */}
            <Box position="relative" textAlign="center">
              <LetterFlyIn color="perygonPink">Help me...</LetterFlyIn>
              <Text
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="bold"
                mt={-2}
                color="gray.700"
                textShadow="1px 1px 2px rgba(0,0,0,0.2)"
              >
                Oops! An error has occurred.
              </Text>
            </Box>

            {/* Supporting text */}
            <Text fontSize="lg" textAlign="center" color="gray.500" maxW="md">
              It looks like your session may have expired or the page you are
              looking for doesn&apos;t exist anymore. Login to get yourself back
              on track.
            </Text>

            {/* Button with smooth animation */}
            <Button
              variant="solid"
              size="lg"
              bg="perygonPink"
              color="white"
              _hover={{ bg: "pink.500", transform: "scale(1.05)" }}
              _active={{ bg: "pink.600" }}
              transition="all 0.3s ease"
              boxShadow="lg"
              onClick={logout}
            >
              Back to Login
            </Button>
          </VStack>
        </SpringScale>

        {/* Decorative floating elements */}
        <Box
          position="absolute"
          bottom="20%"
          right="10%"
          boxSize="200px"
          bg="rgba(255, 0, 112, 0.1)"
          borderRadius="full"
          zIndex={-1}
          animation={`${floatingAnimation} 8s ease-in-out infinite`}
        />
        <Box
          position="absolute"
          top="10%"
          left="10%"
          boxSize="300px"
          bg="rgba(144, 224, 239, 0.1)"
          borderRadius="full"
          zIndex={-1}
          animation={`${floatingAnimation} 12s ease-in-out infinite`}
        />
      </Center>
    </PerygonContainer>
  );
}
