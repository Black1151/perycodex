"use client";

import { Box, Image, VStack } from "@chakra-ui/react";
import { ReactNode } from "react";
import { SpringScale } from "../animations/SpringScale";

interface LoginCardProps {
  titleComponent: ReactNode;
  children: ReactNode;
  height?: number | string;
  imageOffset?: number;
  backgroundOffset?: number;
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
            p={[15, 8]}
            overflow="hidden"
            borderRadius="md"
            boxShadow="md"
            position="relative"
            height={height}
            justifyContent="flex-end"
            width={["100%", 480]}
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
          <Box width="100%">{children}</Box>
        </VStack>
      </SpringScale>
  );
}
