"use client";

import { Center, VStack, Flex } from "@chakra-ui/react";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { LoginCard } from "@/components/login/LoginCard";
import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";
import { SignUpPageClient } from "./SignUpPageClient";
import { useEffect, useState } from "react";
import SignUpCard, { Action } from "@/components/login/SignUpCard";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  Stack,
} from "@chakra-ui/react";
import { useTheme } from "@chakra-ui/react";

const actions: Action[] = [
  { label: "Go To Login...", href: "https://facebook.com" },
];

export default function SignUpPage() {
  const [title, setTitle] = useState("Sign up");
  const [description, setDescription] = useState("");
  const theme = useTheme();

  return (
    <Flex
      minH="100vh"
      bg="gray.100"
      align="center"
      justify="center"
      p={4}
      bgGradient={theme.gradients.primaryGradient}
    >
      <SignUpCard
        title="Sign up"
        description="Want to keep up to date with all our latest news and information? Enter your email below to be added to our mailing list."
        actions={actions}
      >
        <Box width="full" maxW="md">
          <SignUpPageClient />
        </Box>
      </SignUpCard>
    </Flex>
  );
}
