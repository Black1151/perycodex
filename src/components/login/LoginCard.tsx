"use client";

import {Box, Image, ResponsiveValue, VStack} from "@chakra-ui/react";
import {ReactNode} from "react";
import {SpringScale} from "../animations/SpringScale";
import {useSearchParams} from "next/navigation";

interface LoginCardProps {
    titleComponent: ReactNode;
    children: ReactNode;
    height?: ResponsiveValue<number | string>;
    imageOffset?: ResponsiveValue<number | string>;
    backgroundOffset?: number;
}

export function LoginCard({
                              titleComponent,
                              children,
                              height = 700,
                              imageOffset = -350,
                          }: LoginCardProps) {
    const searchParams = useSearchParams();
    const appleAccountLinked = searchParams.get("appleAccountLinked");
    return (
        <SpringScale style={{width: '100%'}}>
            <VStack
                bg="white"
                spacing={4}
                align="center"
                p={[8, 8]}
                overflow="hidden"
                borderRadius="md"
                boxShadow="md"
                position="relative"
                height={height}
                justifyContent="flex-end"
                width={["100%", null, appleAccountLinked != '' ? 393 : 480]}
                maxW={"100%"}
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
