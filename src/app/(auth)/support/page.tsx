import React from "react";
import {
    Box,
    Button,
    Container,
    Heading,
    Link as ChakraLink,
    Stack,
    Text,
} from "@chakra-ui/react";
import Link from "next/link";
import PublicLayout from "@/components/public/PublicLayout";

export default function SupportPage() {
    return (
        <PublicLayout>
            <Container maxW="container.lg" py={8}>
                {/* MAIN SECTION */}
                <Stack
                    direction={["column", "row"]}
                    spacing={8}
                    align="flex-start"
                >
                    {/* Left Column: Support Explanation & Contact Info */}
                    <Box flex="1">
                        <Heading as="h1" size="2xl" mb={4}>
                            Need Help?
                        </Heading>

                        <Text fontSize="lg" mb={4}>
                            We’re here to assist you with any technical issues, account inquiries, or
                            general questions you may have about Perygon. Our friendly support team
                            is dedicated to ensuring a smooth experience for you and your business.
                        </Text>

                        <Heading as="h2" size="md" mb={2}>
                            Contact Details
                        </Heading>
                        <Text mb={2} fontSize="lg">
                            Prefer email? Reach out to us at{" "}
                            <ChakraLink
                                href="mailto:supportteam@perygon.co.uk"
                                textDecoration="underline"
                                color="blue.500"
                            >
                                supportteam@perygon.co.uk
                            </ChakraLink>
                            .
                        </Text>

                        <Text fontSize="lg" mb={2}>
                            Or give us a call at the Sedulo Leeds office:{" "}
                            <strong>0333 222 4445</strong>.
                        </Text>

                        <Text fontSize="lg" mt={2}>
                            <strong>Address:</strong>
                            <br/>
                            St Paul’s House
                            <br/>
                            23 Park Square South
                            <br/>
                            Leeds
                            <br/>
                            LS1 2ND
                            <br/>
                            United Kingdom
                        </Text>

                        <Box mt={6}>
                            <a
                                href="mailto:supportteam@perygon.co.uk"
                                style={{textAlign: "end", maxWidth: "100%"}}
                            >
                                <Button
                                    color="white"
                                    bg="green"
                                    fontSize={["12px", "18px"]}
                                    _hover={{
                                        bg: "perygonPink",
                                    }}
                                    _active={{
                                        bg: "white",
                                        color: "perygonPink",
                                    }}
                                >
                                    Click here to email our Support Team
                                </Button>
                            </a>
                        </Box>
                    </Box>

                    {/* Right Column: Sticky Branding or Imagery */}
                    <Box
                        flex="1"
                        textAlign="center"
                        position="sticky"
                        top="0"
                        display={["none", "none", "none", "block"]}
                    >
                        <Text
                            as="span"
                            fontSize="96px"
                            fontWeight={200}
                            fontFamily="Bonfire"
                            color="perygonPink"
                        >
                            Support
                        </Text>
                    </Box>
                </Stack>
            </Container>
        </PublicLayout>
    );
}
