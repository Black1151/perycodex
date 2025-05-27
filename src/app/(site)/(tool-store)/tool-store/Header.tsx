import { Flex, HStack, Text } from "@chakra-ui/react";
import { useTheme } from "@chakra-ui/react";
import BackButton from "@/components/BackButton";
import BillingCycleToggle from "./BillingCyleToggle";

interface HeaderProps {
    title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
    const theme = useTheme();

    return (
        <Flex
            flexDirection={["column", "column", "row"]}
            gap={0}
            w="100%"
            justify="space-between"
            mb={4}
        >
            <HStack spacing={2} align={"center"}>
                <BackButton />
                <Text
                    fontWeight="400"
                    color={theme.colors.elementBG}
                    fontFamily="bonfire"
                    fontSize={[34, 32, 42]}
                >
                    {title}
                </Text>
            </HStack>
            <BillingCycleToggle />
        </Flex>
    );
}