"use client";

import {Button, Flex, Text, Image, useBreakpointValue} from "@chakra-ui/react";

interface LoginFormButtonsProps {
    loading: boolean;
    handleButtonClick: (buttonId: "microsoft" | "google") => void;
}

const LoginFormButtons: React.FC<LoginFormButtonsProps> = ({loading, handleButtonClick}) => {
    const showText = useBreakpointValue({base: false, md: true});

    return (
        <Flex justify="space-around" gap={{base: 6, md: 4}} flexDirection={{base: "row", md: "column"}}>
            <Button
                px={6}
                height={12}
                isLoading={loading}
                color="lightGray"
                backgroundColor="white"
                border="1px solid lightGray"
                _hover={{color: "white", backgroundColor: "lightGray"}}
                onClick={() => handleButtonClick("microsoft")}
            >
                <Flex align="center" justify={showText ? "flex-start" : "center"} gap={showText ? 4 : 0} width="100%">
                    <Image
                        src="https://perygonblob.blob.core.windows.net/public/Microsoft.png?sp=r&st=2024-10-29T11:53:27Z&se=2030-11-01T19:53:27Z&sv=2022-11-02&sr=c&sig=6el1LfIDyAeUG4tDxdrAm9t%2FLl8tg0Mysfc9lrB1g5Q%3D"
                        alt="Microsoft"
                        boxSize={6}/>
                    {showText && <Text>Continue with Microsoft</Text>}
                </Flex>
            </Button>
            <Button
                px={6}
                height={12}
                isLoading={loading}
                color="lightGray"
                backgroundColor="white"
                border="1px solid lightGray"
                _hover={{color: "white", backgroundColor: "lightGray"}}
                onClick={() => handleButtonClick("google")}
            >
                <Flex align="center" justify={showText ? "flex-start" : "center"} gap={showText ? 4 : 0} width="100%">
                    <Image
                        src="https://perygonblob.blob.core.windows.net/public/google.png?sp=r&st=2024-10-29T11:53:27Z&se=2030-11-01T19:53:27Z&sv=2022-11-02&sr=c&sig=6el1LfIDyAeUG4tDxdrAm9t%2FLl8tg0Mysfc9lrB1g5Q%3D"
                        alt="Google" boxSize={6}/>
                    {showText && <Text>Continue with Google</Text>}
                </Flex>
            </Button>
        </Flex>
    );
};

export default LoginFormButtons;
