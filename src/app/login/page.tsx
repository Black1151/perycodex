"use client";

import { Box, Center, Text, Image, VStack } from "@chakra-ui/react";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { LoginForm, LoginFormInputs } from "./LoginForm";
import { SubmitHandler } from "react-hook-form";
import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";
import axios from "axios";

export default function LoginPage() {
  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const response = await axios.post("/api/auth", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(response);

      if (response.status === 200) {
        // redirection logic or other side effects
      } else {
        console.error("Login failed", response.data);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  return (
    <PerygonContainer>
      <Center flex={1}>
        <VStack bg="white" boxShadow="lg" rounded="md" overflow="hidden">
          <Box w="100%" mb={10} position="relative">
            <Image
              top={0}
              objectPosition="bottom"
              src={"/perygonSpeechBubble.png"}
              objectFit="none"
              position="absolute"
            />
            <Box left="120px" top="130px" position="absolute">
              <LetterFlyIn>BallSack</LetterFlyIn>
            </Box>
          </Box>
          <Box h={400} />

          <LoginForm onSubmit={onSubmit} isSubmitting={false} errors={{}} />
        </VStack>
      </Center>
    </PerygonContainer>
  );
}
