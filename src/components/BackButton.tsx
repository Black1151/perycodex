"use client";

import React from "react";
import {ArrowBack} from "@mui/icons-material";
import {Flex, useBreakpointValue} from "@chakra-ui/react";
import {useRouter} from "next/navigation";

export default function BackButton({prevRoute}: { prevRoute?: string }) {
    const router = useRouter();
    const isMobile = useBreakpointValue({base: true, md: false});

    const handleClickBack = () => {
        if (prevRoute) {
            router.push(prevRoute);
            return;
        }
        router.back();
    };

    return (
            <Flex
                as="button"
                onClick={handleClickBack}
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                h="full"
                color="white"
                _hover={{
                    color: "gray.300",
                    transform: "translateX(-5px)",
                }}
                _active={{color: "gray.500"}}
                transition="all 0.2s ease-in-out"
            >
                <ArrowBack fontSize={isMobile ? "medium" : "large"}/>
            </Flex>
    );
}
