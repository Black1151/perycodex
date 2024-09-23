"use client";
import {
    VStack,
    Text,
    useTheme
} from "@chakra-ui/react";
import {useRouter} from "next/navigation";

export default function Sidebar() {
    const theme = useTheme();
    const router = useRouter();

    return (
        <VStack
            align="start"
            spacing={4}
            width="250px"
            bg={theme.colors.gray[800]}
            color="white"
            p={5}
            flexShrink={0}
        >
            <Text
                cursor="pointer"
                _hover={{
                    color:
                    theme.colors.perygonPink
                }}
                onClick={() => router.push('/customers')}>
                Customers
            </Text>
            <Text
                cursor="pointer"
                _hover={{
                    color:
                    theme.colors.perygonPink
                }}
                onClick={() => router.push('/users')}>
                Users
            </Text>
            <Text
                cursor="pointer"
                _hover={{
                    color:
                    theme.colors.perygonPink
                }}
                onClick={() => console.log("Sites Clicked")}>
                Sites
            </Text>
            <Text
                cursor="pointer"
                _hover={{
                    color:
                    theme.colors.perygonPink
                }}
                onClick={() => console.log("Teams Clicked")}>
                Teams
            </Text>
            <Text
                cursor="pointer"
                _hover={{
                    color:
                    theme.colors.perygonPink
                }}
                onClick={() => console.log("User Groups Clicked")}>
                User
                Groups
            </Text>
            <Text
                cursor="pointer"
                _hover={{
                    color:
                    theme.colors.perygonPink
                }}
                onClick={() => console.log("Tags Clicked")}>
                Tags
            </Text>
        </VStack>
    );
}
