import {VStack, Text, useTheme} from "@chakra-ui/react";

export default function Sidebar() {
    const theme = useTheme();

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
            <Text cursor="pointer" _hover={{color: theme.colors.perygonPink}} onClick={() => console.log("Customers Clicked")}>
                Customers
            </Text>
            <Text cursor="pointer" _hover={{color: theme.colors.perygonPink}} onClick={() => console.log("Users Clicked")}>
                Users
            </Text>
            <Text cursor="pointer" _hover={{color: theme.colors.perygonPink}} onClick={() => console.log("Sites Clicked")}>
                Sites
            </Text>
            <Text cursor="pointer" _hover={{color: theme.colors.perygonPink}} onClick={() => console.log("Teams Clicked")}>
                Teams
            </Text>
            <Text cursor="pointer" _hover={{color: theme.colors.perygonPink}} onClick={() => console.log("User Groups Clicked")}>
                User Groups
            </Text>
            <Text cursor="pointer" _hover={{color: theme.colors.perygonPink}} onClick={() => console.log("Tags Clicked")}>
                Tags
            </Text>
        </VStack>
    );
}
