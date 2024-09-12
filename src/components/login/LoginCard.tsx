"use client";

import { Image, VStack, Box } from "@chakra-ui/react";
import { ReactNode } from "react";
import { SpringScale } from "../animations/SpringScale";

interface LoginCardProps {
  titleComponent: ReactNode;
  children: ReactNode;
  height?: number | string;
  imageOffset?: number | string;
}

export function LoginCard({
  titleComponent,
  children,
  height = 700,
  imageOffset = -350,
}: LoginCardProps) {
  return (
    <SpringScale>
      <VStack
        bg="white"
        spacing={4}
        align="center"
        p={4}
        overflow="hidden"
        borderRadius="md"
        boxShadow="md"
        position="relative"
        height={height}
        justifyContent="flex-end"
      >
        <Image
          src="/perygonSpeechBubble.png"
          alt="Perygon"
          position="absolute"
          boxSize="100%"
          objectFit="cover"
          top={imageOffset}
          objectPosition="bottom"
        />
        {titleComponent}
        <Box width="full">{children}</Box>
      </VStack>
    </SpringScale>
  );
}
